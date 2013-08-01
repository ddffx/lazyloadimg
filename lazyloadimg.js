/* 
 * Lazy Loading Images using requestAnimationFrame
 * Based on http://css-tricks.com/snippets/javascript/lazy-loading-images/
 * & http://www.html5rocks.com/en/tutorials/speed/animations/
 * lazyloadimg.js (c) Deb Das
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * Expects a list of containers span or div like:  
 * `<span class="lazy" data-img-src="image_src_url"></span>`
 * Class lazy is required
 * rAF polyfil available here: https://gist.github.com/paulirish/1579671
 */

(function(window) {
  var $q = function(q, res) {
    if (document.querySelectorAll) {
      res = document.querySelectorAll(q);
    } else {
      var d = document,
        a = d.styleSheets[0] || d.createStyleSheet();
      a.addRule(q, 'f:b');
      for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
        l[b].currentStyle.f && c.push(l[b]);

      a.removeRule(0);
      res = c;
    }
    return res;
  }, 
  addEventListener = function(evt, fn) {
      window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent) ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
    }, _has = function(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
  },

 loadImage = function (el, index, fn) {
    var img = new Image(),
      src = el.getAttribute('data-img-src');
    img.onload = function(e, i) {
     
      el.appendChild(e.target);
      
      fn ? fn(index) : null;
    }
    img.src = src;
  },

  elementInViewport = function(el) {
    var rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
  };

  var img_containers = new Array(),
    query = $q('.lazy'),
    ticking = false,
    processScroll = function() {
      ticking = true;
      
      for (var i = 0; i < img_containers.length; i++) {
          var el = img_containers[i].item;
        if (elementInViewport(el)) {
          
          if(!el.loaded && !el.loading){
            el.loading = true;
            console.log("image "+ i+" loading");
            loadImage(el, i, function(index) {
              
              console.log("called for image: " + index);
              
              img_containers[index].loaded = true;
              img_containers[index].loading = false;
              console.log("image "+ index +" loaded");
              
            });
          }
          
        }
      };
      ticking = false;
      
    }, 
    onScroll = function() {
      requestTick();
    }, 
    requestTick = function() {
     
      if (!ticking) {
        console.log("rAF called");
        requestAnimationFrame(processScroll);

      }
    };

  
  for (var i = 0; i < query.length; i++) {
    img_containers.push({
      item: query[i],
      loaded: false,
      loading: false
    });
    
  };
  
  processScroll();
  addEventListener('scroll', onScroll);

}(this));