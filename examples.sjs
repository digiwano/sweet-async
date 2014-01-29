(function(){

  function example_tick() {
    // assumes existence of process.nextTick(), so in browser only works if something
    // else (such as browserify) has created a process.nextTick(). use $async:pause for
    // places w/o process.nextTick
    $async:tick;
    doSomething();
  }

  function example_pause() {
    // uses process.nextTick() if avail, falls back to setTimeout
    $async:pause;
    doSomething();
  }

  function example_sleep() {
    console.log("will sleep 125 ms");
    $async:sleep(125);
    console.log("will sleep 250 ms");
    $async:sleep(250 ms);
    console.log("will sleep 500 ms");
    $async:sleep(0.5 sec);
    console.log("will sleep 1000 ms");
    $async:sleep(1 s);
    console.log("done!");
  }

  function example_var(filename, callback) {
    $async:var data = fs.readFile( filename, -->callback );
    callback(null, data);
  }

  function still_testing() {
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
  }

  module.exports = example;
}).call();
