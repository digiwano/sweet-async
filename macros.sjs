// self-bound function
macro $fn {
  rule { {$body ...} } => {
    $fn () {$body ...}
  }
  rule { $args { $body... } } => {
    (function $args { $body...}).bind(this)
  }
}


// finds --> recursively within a block and replaces it with a call to the given callback
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
    var _rest = $fn{ $rest ... };
    $arrows(_rest $block)
  }
}


macro $async_wait {
  rule {
    { $body ... } $rest ...
  } => {
    var _rest = $fn{ $rest ... }
    $arrows(_rest $body ...)
  }
}

macro $async_tick {
  // swallow (optional) trailing ; on $async:tick;
  rule { ; $rest ... } => { $async_tick $rest ... }
  rule { $rest ... } => {
    process.nextTick($fn{ $rest ... });
  }
}

macro $async_pause {
  rule { ; $rest ... } => { $async_pause $rest ... }
  rule { $rest ... } => {
    ((typeof process == 'object' && process.nextTick) ?
      process.nextTick : setTimeout)($fn{ $rest... }, 0)
  }
}

macro $async_sleep {
  rule { ($x...) ; $rest ... } => {
    $async_sleep($x...) $rest ...
  }
  rule { ($x sec) $rest ... } => {
    $async_sleep(($x * 1000)) $rest ...
  }
  rule { ($x s) $rest ... } => {
    $async_sleep($x sec) $rest ...
  }
  rule { ($x ms) $rest ... } => {
    $async_sleep($x) $rest ...
  }
  rule { ($x) $rest ... } => {
    setTimeout($fn{ $rest ... }, $x);
  }
  rule { () } => { $async_pause }
}


// i want to try to refactor this to use $arrows
macro $async_var {
  rule { $name:ident = $cmd:expr $rest ... } => {
    $async_var ( --> , $name) = $cmd $rest ...
  }

  // with error callback
  rule {
    ( $argl ... --> $argr ... ) =
    $cmd ... ( $cmdl ...  --> $callback $cmdr ... ) ;
    $rest ...
  } => {
    $cmd ... ( $cmdl ...
      ($fn ( $argl ... error $argr ... ) {
        if ( error ) { return $callback ( error ); }
        $rest ...
      })
    $cmdr ... ) ;
  }

  // for no error callback
  rule {
    ( $args (,) ... ) = $cmd ...
    ($cmdl ... --> $cmdr ... ) ; $rest ...
  } => {
    $cmd ... ( $cmdl ... ($fn ( $args (,) ... ) { $rest ... }) $cmdr ... )
  }
}

macro $async {
  rule { : var   } => { $async_var   }
  rule { : wait  } => { $async_wait  }
  rule { : pause } => { $async_pause }
  rule { : tick  } => { $async_tick  }
  rule { : sleep } => { $async_sleep }
  rule { : block } => { $async_block }
}

export $async
