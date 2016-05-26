/*!
 * utilitySet - v1.0.0 - 2016-05-26
 * http://www.milanvasic.com
 * Copyright (c) 2016 Milan Vasic
 * Licensed MIT ()
*/

(function($) { 

  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name] !== undefined) {
        if (o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
  /**
   * @desc sets height and alternative scrollbar on fixed height element
   */
  $.fn.setScroll = function (h,exclude) {
    if (h === false) { // disable
      _.each(this, function (item) {
        // if ($(item).is(":visible") && $(item).hasClass("ps-container")) {
        if ($(item).is(":visible")) {
          $(item).css({
            height: '',
            overflow:'auto'
          });
          // }).perfectScrollbar('destroy');
        };
      })
      return false;
    } else {
      var heightExclusion = $(".top-row");
      var fullH = heightExclusion.is(":visible") ? $(window).height() - heightExclusion.outerHeight() : $(window).height();
      var height = typeof h !== 'undefined' ? h : fullH;
      _.each(this, function (item) {
        $(item).css({
          height: height + 'px',
          overflow: 'auto',
          position:'relative'
        })

        // turned of ps-scrollbar for now until magicsuggest conflict is resolved

        /*if (!$(item).hasClass("ps-container")) {
          $(item).perfectScrollbar({
            suppressScrollX: true,
            wheelPropagation: true,
            stopPropagationOnClick: false
          });
        };*/
      })

      // adjust scroll on window resize
      /*$(window).resize(function (e) {
        e.stopPropagation();
        var heightExclusion = $(".top-row");
        var fullH = heightExclusion.is(":visible") ? $(window).height() - heightExclusion.outerHeight() : $(window).height();
        var height = fullH;
        if ($(".ps-container").length > 0) {
          $(".ps-container").each(function () {
            $(this).css({
              height: height + 'px'
            }).perfectScrollbar('update');
          })
        }
        ;
      })*/
    }
  };

  /* shorthand add/remove class method (will be expanded later for more options) */
  $.fn.set = function (string) {
    var attr_arr = string.trim().split(" ");
    var data = {
      '+':{ func:'addClass', values:[] },
      '-':{ func:'removeClass', values:[] }
    }

    for (var i = 0; i < attr_arr.length; i++) {
      data[attr_arr[i].charAt(0)].values.push(attr_arr[i].substring(1))
    };

    return this.each(function(){
      var _this = $(this);

      $.each( data, function(index, val){
        if (val.values.length) {
          $.fn[val.func].call(_this,val.values.join(" "))
        };
      });

      return _this;
    })

  }


  jQuery.fn.cCSS = function(css) {
    return this.each(function(){
      var css_obj = {};
      var tmx = "";
      ocss = css.split(";");
      $.each(ocss, function (index, elem){
          tmx = elem.trim().split(':');
          if (tmx[0].length > 0)
              css_obj[tmx[0]] = tmx[1].trim();

      });
      return  $(this).css(css_obj);
    });
  };

  $.fn.maxHeight = function (options) {
    var settings = $.extend({
      exclude: false,
      add: 0,
      height:'auto'
    }, options );

    var wh = $(window).height();
    var heightExclusion = !!settings.exclude ? $(settings.exclude).outerHeight() : 0;

    if ($(this).outerHeight() < wh - heightExclusion) {
      settings.height = (wh - heightExclusion + settings.add) + 'px';
    };

    return this.css({ height: settings.height });
  };


  /**
   * @desc sets height and alternative scrollbar on fixed height element
   */
  $.fn.readMore = function (options) {
    var settings = $.extend({
      words: 20,
      class_name: 'read-more-con',
      trail: '...',
      moreText: 'Expand',
      lessText: 'Show less',
      parentContainer: 'body'
    }, options);

    return this.each(function () {
      var $t = $(this);
      $t.addClass(settings.class_name)
      var originalData = $t.text();
      var textData = $t.text().split(" ");
      if (textData.length > settings.words) {
        var output = _.partition(textData, function (value, key) {
          return key < settings.words;
        })

        var shortText = output[0].join(" ") + settings.trail;
        $t.html('\
          <span class="read-more-short">' + shortText + '</span>\
          <span class="read-more-original" style="display:none;">' + originalData + '</span>\
          <br/><a href="#" class="read-more-toggle" style="float:right">' + settings.moreText + '</a>').attr('data-state', 'short');

        $(".read-more-toggle").click(function (e) {
          e.stopPropagation();
          var root = $(this).closest('.' + settings.class_name)
          // var root = $(this.closest('.read-more'))
          var order = root.attr('data-state') === 'short' ? ['short', 'original'] : ['original', 'short']
          var toggleText = root.attr('data-state') === 'short' ? settings.lessText : settings.moreText;
          var switch_duration = 300;

          root
            .find('.read-more-toggle').html(toggleText)
            .end().find('.read-more-' + order[0]).slideUp(switch_duration)

          setTimeout(function () {
            root.find('.read-more-' + order[1]).slideDown(switch_duration)
              .end().attr('data-state', order[1])
          }, switch_duration);
        })
      }
      ;
    })
  }

  /**
   * @desc toggles between edit and static emenets inside an element
   */
  $.fn.editMode = function (active,cb) {
    var activate = typeof active !== 'undefined' ? active : true;
    return this.each(function () {
      if (activate) {
        $(this).addClass('edit-mode-on');
      } else {
        $('.edit-mode-on *:focus').blur(); // remove focus from all fields
        $(this).removeClass('edit-mode-on')
      }
      if(!!cb) cb();
    })
  }

  /**
   * @desc Scroll to element if it's not fully in view
   * (works only for scrolling down for now)
   */
  $.fn.scrollToMe = function (options) {
    var settings = $.extend({
      gap: 0,
      complete: function(elem) {
        // add callback here (...elem is the element being scrolled to)
      }
    }, options);

    return this.each(function () {
      var y = $(this).offset().top - $(window).scrollTop();
      var offsetY = $(this).offset().top - ($(window).height()-$(this).outerHeight());

      if (y + $(this).outerHeight() + settings.gap > $(window).height()) {
        $('html, body').animate({
          scrollTop: offsetY+settings.gap
        }, 500, function(){
          settings.complete($(this)); // run callback
        });
      } else {
        settings.complete($(this)); // run callback
      }

    })
  }

  /**
   * @desc Swaps items not in view into a more menu popover
   */
  $.fn.swapper = function (options) {
    this.each(function(){
      var self = this;

      var settings = $.extend({
        items: null,
        po_class: 'swap-menu'
      }, options);

      self.init = function() {
        if (!settings.items) {
          alert('Swapper: parameter "items" has not been defined!')
          return false;
        }

        $(self).attr('data-toggle','popover').attr('data-content','').attr('data-trigger','focus');
        self.events();
      }
      self.events = function() {
        $(self).click(function(e){
          var root = $(e.currentTarget);
          root.attr('data-content','<ul>'+self.generate()+'</ul>');

          root.popover({
            animation:false,
            html:true,
            placement:'bottom',
            container: 'body',
            template:'<div class="popover '+settings.po_class+'" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
            trigger:'manual'
          }).popover('toggle');
        })
      }
      self.generate = function() {
        var top = $(settings.items).offset().top; // gets first offset
        var output = ''; // holds items that are to be shown in the second manu
        $(settings.items).each(function(){
          if ($(this).offset().top > top) {
            output += '<li>'+$(this).html()+'</li>';
          };
        })
        return output;
      }
      self.init();

    })
    return this;
  }

  /**
   * Custom plugin for responsive carousel display
   */
  $.fn.hSlider = function (options) {
      this.each(function(){
        var self = this;

        self.data = {
          slide_state: 0,
          per_view:false,
          num:0
        }

        var settings = $.extend({
          target: false,
          parent: false,
          context:false,
          nav_width:63,
          speed:500,
          nav_class:'nav-arrow'
        }, options);

        self.methods = {
            init: function() {
              self.methods.setContext();
              settings.parent = $(self);
              self.data.num = $(settings.target,settings.context).length;
              self.data.per_view = self.methods.perView();
              self.methods.setSizes();
              self.methods.setTriggers();

              var slideTo = 0;
              $(settings.target,settings.context).each(function(){
                if (typeof $(this).attr("data-slide-to") !== 'undefined' && $(this,settings.context).attr("data-slide-to") !== false) {
                  $(this).attr("data-slide-to",slideTo);
                  slideTo++;
                }
              })

              self.methods.updateNav();
            },
            setContext: function() {
              // set plugin context
              var rand = Math.floor((Math.random() * 999999999) + 1);
              $(self).closest('.h-slider').attr('id','hslider_'+rand);
              settings.context = "#hslider_"+rand;
            },
            setSizes: function() {
              // calculate width in %


              var w_view = $(settings.parent).parent().width();
              var w_pixels = w_view/self.methods.perView();
              var w_total_pixels = w_pixels*self.data.num;
              var w_total_perc = 100*w_total_pixels / w_view;

              var marginXpx = 30;
              var marginXperc = (w_total_perc * marginXpx) / w_total_pixels;
              marginXperc = marginXperc / $(settings.target,settings.context).length;

              var w_perc = 100*w_pixels / w_total_pixels - marginXperc*1.5;

              // adjust width of parent container
              $(settings.parent,settings.context).css({
                width:(w_total_perc)+"%"
                // overflow:'auto'
              })

              // size of individual block item
              $(settings.target,settings.context).each(function(){
                this.style.setProperty( 'width', w_perc+'%', 'important' );
                this.style.setProperty( 'margin-left', marginXperc/2+'%', 'important' );
                this.style.setProperty( 'margin-right', marginXperc/2+'%', 'important' );
              })

              $(settings.parent).parent().css({
                overflow:'hidden'
              })
            },
            updateNav: function() {
              var root = $(settings.target,settings.context).closest('.h-slider');
              // disable left arrow
              if (self.data.slide_state > 0) {
                root.removeClass('no-left');
              } else {
                root.addClass('no-left');
              }

              // disable right arrow
              if (self.data.slide_state == self.methods.numOfSlides()-1) {
                root.addClass('no-right');
              } else {
                root.removeClass('no-right');
              }
            },
            setTriggers: function() {
              // nav triggers
              $('.'+settings.nav_class,settings.context).click(function(e){
                var root = $(e.currentTarget);
                if (root.hasClass('left')) {
                  self.methods.slide((self.data.slide_state-1));
                } else if (root.hasClass('right')) {
                  self.methods.slide((self.data.slide_state+1));
                }
              })
            },
            perView: function() {
              return 3;
            },
            numOfSlides: function() {
              return Math.ceil(self.data.num/self.methods.perView());
            },
            slide: function(tgt) {
              if (tgt < 0 || tgt == self.methods.numOfSlides()) return false; // break if first or last

              self.data.slide_state = tgt;
              self.methods.updateNav();

              $(settings.parent).animate({
                marginLeft:(-100*self.data.slide_state)+'%'
              },settings.speed)
            }
        };

        self.methods.init();
      })

      return this;
  }

  /**
   * @desc Checks if scrollbar is active on element
   */
  $.fn.hasScrollBar = function() {
    return this.get(0).scrollHeight > this.height();
  }
})(jQuery);