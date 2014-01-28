
function testy(filename, callback) {
  // assumes existence of process.nextTick(), so in browser only works if something
  // else (such as browserify) has created a process.nextTick(). use $async:pause for
  // places w/o process.nextTick
  $async:tick;

  // uses process.nextTick() if avail, falls back to setTimeout
  $async:pause;

  $async:var data = fs.readFile(filename, -->callback );

  // getting closer but for both block/wait i need a way to make them
  // auto-error-generate-y with -->callback, which $arrows doesnt do yet
  // prolly need
  //   $arrows(_next _err $tokens...)
  // rather than
  //   $arrows(_next $tokens)
  // or maybe $arrows(_next, _err) { $tokens...} at this point just to clean it a bit?
  // or maybe $async<callback>:block or $async:block<callback>;
  if (true) $async:block {
    doSomethingAsync( --> );
  }

  $async:wait {
    doSomethingElseAsync( --> );
  }

  $async:tick;

  // hopefully once the above two work,
  // $async:if and $async:for can use $async:block internally
  /*
  $async:if (foo > 4) {
    dontDoAnything(-->);
  } else if (foo < 2) {
    seriousPleaseDont(-->);
  } else {
    stopDoingThings(-->);
  }

  $async:for (var i = 0; i < 10; i++) {

  }

  // these should not have the same name but idk what to call them
  // for ary vs obj for asyng equivs of (for i in / for i of)
  $async:each (ary    -> v) { ... }
  $async:each (ary[i] -> v) { ... }

  $async:each (obj    -> v) { ... }
  $async:each (obj[k] -> v) { ... }

  */

  callback(null);
}
