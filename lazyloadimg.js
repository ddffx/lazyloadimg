/* http://css-tricks.com/snippets/javascript/lazy-loading-images/
 *lazyload.js (c) Lorenzo Giuliani
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:  
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 With RequestAnimationFrame
 Polyfill Available here: 
 */

! function(window) {
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
  }, addEventListener = function(evt, fn) {
      window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent) ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
    }, _has = function(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };

  function loadImage(el, index, fn) {
    var img = new Image(),
      src = el.getAttribute('data-src');
    img.onload = function(e, i) {

      if ( !! el.parent) {
        console.log('if block');
        el.parent.replaceChild(img, el)
      } else {
        console.log('else block');
        el.src = src;
      }

      //console.log(arguments);
      fn ? fn(index) : null;
    }
    img.src = src;
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight))
  }

  var images = new Array(),
    query = $q('img.lazy'),
    ticking = false,
    processScroll = function() {
      ticking = true;
      console.log("ticking true");
      //console.log(images);
      for (var i = 0; i < images.length; i++) {

        if (elementInViewport(images[i].img)) {
          
          if(!images[i].loaded && !images[i].loading){
            images[i].loading = true;
            console.log("image "+ i+" loading");
            loadImage(images[i].img, i, function(index) {
              console.log("called for image: " + index);
              //images.splice(index,index);
              images[index].loaded = true;
              images[index].loading = false;
              console.log("image "+ index +" loaded");
              //console.log(images);
            });
          }
          
        }
      };
      ticking = false;
      console.log("ticking false");
    }, onScroll = function() {
      requestTick();
    }, requestTick = function() {
      //console.log(arguments);
      //console.log(ticking);
      if (!ticking) {
        console.log("rAF called");
        requestAnimationFrame(processScroll);

      }
    };

  // Array.prototype.slice.call is not callable under our lovely IE8 
  //console.log(query);
  for (var i = 0; i < query.length; i++) {
    images.push({
      img: query[i],
      loaded: false,
      loading: false
    });
    //images.push(query[i]);
  };
  console.log(images);
  onScroll();
  addEventListener('scroll', onScroll);

}(this);