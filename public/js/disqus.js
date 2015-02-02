
var scripts = document.getElementsByTagName( 'script' );
var thisScriptTag = scripts[ scripts.length - 1 ];
<<<<<<< HEAD
var disqus_shortname = 'participacion-gcba'; // required: replace example with your forum shortname
if ( disqus_shortname != '' ) {
  var disqus_config = function () { 
    this.language = "es_ES";
  };

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();     
}
=======

var disqus_shortname = thisScriptTag.getAttribute('disqus_shortname') ;
disqus_shortname = (window.hackdash && window.hackdash.disqus_shortname) || disqus_shortname;

if (disqus_shortname) {

  if (!window.disqus_loaded){
    window.disqus_loaded = true;

    var disqus_config = function () { 
      this.language = "en";
    };

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
  }
  else {
    /* * * Disqus Reset Function * * */
    DISQUS.reset({ reload: true });
  }
}
>>>>>>> FETCH_HEAD
