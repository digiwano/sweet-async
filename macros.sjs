macro $arrows {
  // recurse into () / {} / [] while leaving the delims themselves intact
  rule { ($n ($a...)) } => {( $arrows($n $a...) )}
  rule { ($n {$a...}) } => {{ $arrows($n $a...) }}
  rule { ($n [$a...]) } => {[ $arrows($n $a...) ]}

  // --> becomes $n
  rule { ($n --> $b...) } => { $n $arrows($n $b...) }

  // if nothing else matches return token unmodified
  rule { ($n $a) } => { $a }

  // only process one arg at a time
  rule { ($n $a $b...) } => {
    $arrows($n $a)
    $arrows($n $b...)
  }

  // $arrows( _c ) and $arrows() are no-ops
  rule { ($n) } => {}
  rule { () } => {}
}

// might not be usable
macro $async_block {
  rule { $block $rest ... } => {
    var _rest = function() { $rest ... }.bind(this);
    $arrows(_rest $block)
  }
}

macro $async_wait {
  rule {
    { $body ... } $rest ...
  } => {
    var _rest = function(){ $rest ... }.bind(this)
    $arrows(_rest $body ...)
  }
}

macro $async_tick {
  rule { ; $rest ... } => { $async_tick $rest ... }
  rule { $rest ... } => {
    process.nextTick(function() {
      $rest ...
    }.bind(this))
  }
}

macro $async_pause {
  rule { ; $rest ... } => { $async_pause $rest ... }
  rule { $rest ... } => {
    var _rest = function() { $rest ... }.bind(this);

    (typeof process == 'object' && process.nextTick) ?
      process.nextTick(_rest) :
        setTimeout(_rest, 0)
  }
}


// i want to try to refactor this to use $arrows
macro $async_var {
  case { $op $name:ident = $cmd:expr $rest ... } => {
    return #{ $op ( --> , $name) = $cmd $rest ... };
  }

  // with error callback
  case {
    $op ( $argl ... --> $argr ... ) =
    $cmd ... ( $cmdl ...  --> $callback $cmdr ... ) ;
    $rest ...
  } => {
    letstx $error = [makeIdent('error', #{$op})];
    return #{
      var _rest = function( $argl ... $error $argr ... ) {
        if ( $error ) {
          return $callback ( $error );
        }
        $rest ...
      }.bind(this);

      $cmd ... ( $cmdl ... _rest $cmdr ... ) ;
    };
  }

  // for no error callback
  case {
    $op ( $args (,) ... ) = $cmd ...
    ($cmdl ... --> $cmdr ... ) ; $rest ...
  } => {
    letstx $error = [makeIdent('error', #{$op})];
    return #{
      var _rest = function( $args (,) ... ) {
          $rest ...
        }.bind(this);
      $cmd ... ( $cmdl ... _rest $cmdr ... )
    };
  }
}

macro $async {
  rule { : var   $rest ... } => { $async_var   $rest ... }
  rule { : wait  $rest ... } => { $async_wait  $rest ... }
  rule { : pause $rest ... } => { $async_pause $rest ... }
  rule { : tick  $rest ... } => { $async_tick  $rest ... }
  rule { : block } => { $async_block }
}

export $async
