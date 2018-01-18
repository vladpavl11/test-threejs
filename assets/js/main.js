/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {



	window.onload = init;
console.ward = function() {}; // what warnings?

function init() {
  var root = new THREERoot({
    createCameraControls: !true,
    antialias: (window.devicePixelRatio === 1),
    fov: 80
  });

  root.renderer.setClearColor(0x000000, 0);
  root.renderer.setPixelRatio(window.devicePixelRatio || 1);
  root.camera.position.set(0, 0, 100);



  var width = 80;
  var height = 130;

 //  var slide = new Slide(width, height, 'out');
	// var l1 = new THREE.ImageLoader();
	// l1.setCrossOrigin('Anonymous');
	// l1.load('images/pic01.jpg', function(img) {
	//   slide.setImage(img);
	// })
 //  root.scene.add(slide);

  var slide2 = new Slide(width, height, 'in');
  var l2 = new THREE.ImageLoader();
	l2.setCrossOrigin('Anonymous');
	l2.load('images/sharksbag1.png', function(img) {
		slide2.setImage(img);
	})
	
  root.scene.add(slide2);

  var timeLine = new TimelineMax({ repeatDelay:1.0});

  // timeLine.add(slide.transition(), 0);
  timeLine.add(slide2.transition(), 0);

  createTweenScrubber(timeLine);
  // pause nimation letter P
  window.addEventListener('keyup', function(e) {
    if (e.keyCode === 80) {
      timeLine.paused(!timeLine.paused());
    }
  });
  var controller = new ScrollMagic.Controller();
  var scrollController = new ScrollMagic.Controller();
  function createScene($tween, $triggerElement, $duration, $triggerHook, $offset) {
          
            var scene = new ScrollMagic.Scene({
              triggerElement: $triggerElement, 
              duration: $duration, 
              triggerHook: $triggerHook,
              offset:$offset
            }).setTween($tween).addTo(scrollController)
            // .addIndicators({name: "tween css class"});
          }
    createScene(timeLine, "#three-container", "800", 100, 150); 
}

////////////////////
// CLASSES
////////////////////

function Slide(width, height, animationPhase) {
  var plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2);

  THREE.BAS.Utils.separateFaces(plane);

  var geometry = new SlideGeometry(plane);

  geometry.bufferUVs();

  var aAnimation = geometry.createAttribute('aAnimation', 2);
  var aStartPosition = geometry.createAttribute('aStartPosition', 3);
  var aControl0 = geometry.createAttribute('aControl0', 3);
  var aControl1 = geometry.createAttribute('aControl1', 3);
  var aEndPosition = geometry.createAttribute('aEndPosition', 3);

  var i, i2, i3, i4, v;

  var minDuration = 0.8;
  var maxDuration = 1.2;
  var maxDelayX = 0.9;
  var maxDelayY = 0.125;
  var stretch = 0.2;

  this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;

  var startPosition = new THREE.Vector3();
  var control0 = new THREE.Vector3();
  var control1 = new THREE.Vector3();
  var endPosition = new THREE.Vector3();

  var tempPoint = new THREE.Vector3();

  function getControlPoint0(centroid) {
    var signY = Math.sign(centroid.y);

    tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
    tempPoint.y = signY * THREE.Math.randFloat(0.1, 0.3) * 70;
    tempPoint.z = THREE.Math.randFloatSpread(10);

    return tempPoint;
  }

  function getControlPoint1(centroid) {
    var signY = Math.sign(centroid.y);

    tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
    tempPoint.y = -signY * THREE.Math.randFloat(0.3, 0.6) * 70;
    tempPoint.z = THREE.Math.randFloatSpread(10);

    return tempPoint;
  }

  for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < geometry.faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
    var face = plane.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(plane, face);

    // animation
    var duration = THREE.Math.randFloat(minDuration, maxDuration);
    var delayX = THREE.Math.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
    var delayY;

    if (animationPhase === 'in') {
      delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY)
    }
    else {
      delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0)
    }

    for (v = 0; v < 6; v += 2) {
      aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * stretch * duration);
      aAnimation.array[i2 + v + 1] = duration;
    }

    // positions

    endPosition.copy(centroid);
    startPosition.copy(centroid);

    if (animationPhase === 'in') {
      control0.copy(centroid).sub(getControlPoint0(centroid));
      control1.copy(centroid).sub(getControlPoint1(centroid));
    }
    else { // out
      control0.copy(centroid).add(getControlPoint0(centroid));
      control1.copy(centroid).add(getControlPoint1(centroid));
    }

    for (v = 0; v < 9; v += 3) {
      aStartPosition.array[i3 + v]     = 100;
      aStartPosition.array[i3 + v + 1] = 100
      aStartPosition.array[i3 + v + 2] = startPosition.z;

      aControl0.array[i3 + v]     = 100;
      aControl0.array[i3 + v + 1] = 100;
      aControl0.array[i3 + v + 2] = control0.z;

      aControl1.array[i3 + v]     = 100;
      aControl1.array[i3 + v + 1] = control1.y;
      aControl1.array[i3 + v + 2] = control1.z;

      aEndPosition.array[i3 + v]     = endPosition.x;
      aEndPosition.array[i3 + v + 1] = endPosition.y;
      aEndPosition.array[i3 + v + 2] = endPosition.z;
    }
  }

  var material = new THREE.BAS.BasicAnimationMaterial(
    {
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        // THREE.BAS.ShaderChunk[(animationPhase === 'in' ? 'ease_out_cubic' : 'ease_in_cubic')],
        THREE.BAS.ShaderChunk['ease_in_quad'],
        // THREE.BAS.ShaderChunk['quaternion_rotation']
      ],
      shaderParameters: [
        'uniform float uTime;',
        'attribute vec2 aAnimation;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aControl0;',
        'attribute vec3 aControl1;',
        'attribute vec3 aEndPosition;',
      ],
      shaderVertexInit: [
        'float tDelay = aAnimation.x;',
        'float tDuration = aAnimation.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
        //'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        (animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
        'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
      ]
    },
    {
      map: new THREE.Texture(),
    }
  );

  THREE.Mesh.call(this, geometry, material);

  this.frustumCulled = false;
}
Slide.prototype = Object.create(THREE.Mesh.prototype);
Slide.prototype.constructor = Slide;
Object.defineProperty(Slide.prototype, 'time', {
  get: function () {
    return this.material.uniforms['uTime'].value;
  },
  set: function (v) {
    this.material.uniforms['uTime'].value = v;
  }
});

Slide.prototype.setImage = function(image) {
  this.material.uniforms.map.value.image = image;
  this.material.uniforms.map.value.needsUpdate = true;
};

Slide.prototype.transition = function() {
  return TweenMax.fromTo(this, 3.0, {time:0.0}, {time:this.totalDuration, ease:Power0.easeInOut});
};


function SlideGeometry(model) {
  THREE.BAS.ModelBufferGeometry.call(this, model);
}
SlideGeometry.prototype = Object.create(THREE.BAS.ModelBufferGeometry.prototype);
SlideGeometry.prototype.constructor = SlideGeometry;
SlideGeometry.prototype.bufferPositions = function () {
  var positionBuffer = this.createAttribute('position', 3).array;

  for (var i = 0; i < this.faceCount; i++) {
    var face = this.modelGeometry.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(this.modelGeometry, face);

    var a = this.modelGeometry.vertices[face.a];
    var b = this.modelGeometry.vertices[face.b];
    var c = this.modelGeometry.vertices[face.c];

    positionBuffer[face.a * 3]     = a.x - centroid.x;
    positionBuffer[face.a * 3 + 1] = a.y - centroid.y;
    positionBuffer[face.a * 3 + 2] = a.z - centroid.z;

    positionBuffer[face.b * 3]     = b.x - centroid.x;
    positionBuffer[face.b * 3 + 1] = b.y - centroid.y;
    positionBuffer[face.b * 3 + 2] = b.z - centroid.z;

    positionBuffer[face.c * 3]     = c.x - centroid.x;
    positionBuffer[face.c * 3 + 1] = c.y - centroid.y;
    positionBuffer[face.c * 3 + 2] = c.z - centroid.z;
  }
};


function THREERoot(params) {
  params = utils.extend({
    fov: 60,
    zNear: 10,
    zFar: 100000,

    createCameraControls: true
  }, params);

  this.renderer = new THREE.WebGLRenderer({
    antialias: params.antialias,
    alpha: true
  });
  this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  // document.getElementById('three-container').appendChild(this.renderer.domElement);
  container = document.getElementById('three-container');
  this.renderer.setSize($(container).width(), $(container).height());
  container.appendChild(this.renderer.domElement);

  this.camera = new THREE.PerspectiveCamera(
    params.fov,
    window.innerWidth / window.innerHeight,
    params.zNear,
    params.zfar
  );

  this.scene = new THREE.Scene();

  if (params.createCameraControls) {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }
window.scene = this.scene;

  this.resize = this.resize.bind(this);
  this.tick = this.tick.bind(this);

  this.resize();
  this.tick();

  window.addEventListener('resize', this.resize, false);
}
THREERoot.prototype = {
  tick: function () {
    this.update();
    this.render();
    requestAnimationFrame(this.tick);
  },
  update: function () {
    this.controls && this.controls.update();
  },
  render: function () {
    this.renderer.render(this.scene, this.camera);
  },
  resize: function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

////////////////////
// UTILS
////////////////////

var utils = {
  extend: function (dst, src) {
    for (var key in src) {
      dst[key] = src[key];
    }

    return dst;
  },
  randSign: function () {
    return Math.random() > 0.5 ? 1 : -1;
  },
  ease: function (ease, t, b, c, d) {
    return b + ease.getRatio(t / d) * c;
  },
  fibSpherePoint: (function () {
    var vec = {x: 0, y: 0, z: 0};
    var G = Math.PI * (3 - Math.sqrt(5));

    return function (i, n, radius) {
      var step = 2.0 / n;
      var r, phi;

      vec.y = i * step - 1 + (step * 0.5);
      r = Math.sqrt(1 - vec.y * vec.y);
      phi = i * G;
      vec.x = Math.cos(phi) * r;
      vec.z = Math.sin(phi) * r;

      radius = radius || 1;

      vec.x *= radius;
      vec.y *= radius;
      vec.z *= radius;

      return vec;
    }
  })(),
  spherePoint: (function () {
    return function (u, v) {
      u === undefined && (u = Math.random());
      v === undefined && (v = Math.random());

      var theta = 2 * Math.PI * u;
      var phi = Math.acos(2 * v - 1);

      var vec = {};
      vec.x = (Math.sin(phi) * Math.cos(theta));
      vec.y = (Math.sin(phi) * Math.sin(theta));
      vec.z = (Math.cos(phi));

      return vec;
    }
  })()
};

function createTweenScrubber(tween, seekSpeed) {
  seekSpeed = seekSpeed || 0.001;

  function stop() {
    TweenMax.to(tween, 1, {timeScale:0});
  }

  function resume() {
    TweenMax.to(tween, 1, {timeScale:1});
  }

  function seek(dx) {
    var progress = tween.progress();
    var p = THREE.Math.clamp((progress + (dx * seekSpeed)), 0, 1);

    tween.progress(p);
  }

  var _cx = 0;

  // desktop
  // var mouseDown = false;
  // // document.body.style.cursor = 'pointer';

  // window.addEventListener('mousedown', function(e) {
  //   mouseDown = true;
  //   document.body.style.cursor = 'ew-resize';
  //   _cx = e.clientX;
  //   stop();
  // });
  // window.addEventListener('mouseup', function(e) {
  //   mouseDown = false;
  //   document.body.style.cursor = 'pointer';
  //   resume();
  // });
  // window.addEventListener('scroll', function(e) {
  //   if (mouseDown === true) {
  //     var cx = e.clientX;
  //     var dx = cx - _cx;
  //     _cx = cx;

  //     seek(dx);
  //   }
  // });
stop();
    console.log('before');

    console.log('initiate');


// tl.play();
// console.log('go');
//  // var cx = e.clientX;
//       var dx = 300;
//  //      _cx = cx;
//  var theScene = new ScrollMagic.Scene({
 
//     triggerElement: "#three-container",
//     triggerHook: 0.1,
//     offset: sceneHeight,
//     duration: 200
//     })
//         .setTween(tl)
//         .addTo(controller);
//         console.log('theScene',theScene);

// var scene = new ScrollMagic.Scene({triggerElement: "#three-container", duration: 300})
//               // animate color and top border in relation to scroll position
//               .setTween("#animate1", {borderTop: "30px solid white", backgroundColor: "blue", scale: 0.7}) // the tween durtion can be omitted and defaults to 1
//               .addTo(controller);








// var position = $(window).scrollTop(); 
// $(window).scroll(function(e) {
//   var scroll = $(window).scrollTop();
//   if (scroll > position) {
//     console.log("scrolling downwards");
//     resume();
//       var cx = e.clientX;
//       var dx = cx - _cx;
//       _cx = cx;

//       seek(dx);
//   } else {
//     console.log("scrolling upwards");
//   }
//     position = scroll;
// });
  // mobile
  // window.addEventListener('scroll', function(e) {
  //   _cx = e.touches[0].clientX;
  //   stop();
  //   e.preventDefault();
  // });
  // window.addEventListener('scroll', function(e) {
  //   resume();
  //   e.preventDefault();
  // });
  // window.addEventListener('scroll', function(e) {
  //   var cx = e.touches[0].clientX;
  //   var dx = cx - _cx;
  //   _cx = cx;

  //   seek(dx);
  //   e.preventDefault();
  // });
}


	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	// $.fn._parallax = function(intensity) {

	// 	var	$window = $(window),
	// 		$this = $(this);

	// 	if (this.length == 0 || intensity === 0)
	// 		return $this;

	// 	if (this.length > 1) {

	// 		for (var i=0; i < this.length; i++)
	// 			$(this[i])._parallax(intensity);

	// 		return $this;

	// 	}

	// 	if (!intensity)
	// 		intensity = 0.25;

	// 	$this.each(function() {

	// 		var $t = $(this),
	// 			$bg = $('<div class="bg"></div>').appendTo($t),
	// 			on, off;

	// 		on = function() {

	// 			$bg
	// 				.removeClass('fixed')
	// 				.css('transform', 'matrix(1,0,0,1,0,0)');

	// 			$window
	// 				.on('scroll._parallax', function() {

	// 					var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

	// 					$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

	// 				});

	// 		};

	// 		off = function() {

	// 			$bg
	// 				.addClass('fixed')
	// 				.css('transform', 'none');

	// 			$window
	// 				.off('scroll._parallax');

	// 		};

	// 		// Disable parallax on ..
	// 			if (skel.vars.browser == 'ie'		// IE
	// 			||	skel.vars.browser == 'edge'		// Edge
	// 			||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
	// 			||	skel.vars.mobile)				// Mobile devices
	// 				off();

	// 		// Enable everywhere else.
	// 			else {

	// 				skel.on('!large -large', on);
	// 				skel.on('+large', off);

	// 			}

	// 	});

	// 	$window
	// 		.off('load._parallax resize._parallax')
	// 		.on('load._parallax resize._parallax', function() {
	// 			$window.trigger('scroll');
	// 		});

	// 	return $(this);

	// };
	// var tl = new TimelineMax({delay:1});
	// tl
	// .add("morphIt")
	
	//  .to("#main", 1, {opacity:1}, "morphIt")
	//  .to("#square", 1, {delay:0.6,morphSVG:".lg",ease: Expo.easeOut}, "morphIt")
	//  .to("#square", 1, {delay:0.6,morphSVG:".st2",ease: Expo.easeOut}, "morphIt")

	// test scroll svg
  // function pathPrepare ($el) {
  //   var lineLength = $el[0].getTotalLength();
  //   $el.css("stroke-dasharray", lineLength);
  //   $el.css("stroke-dashoffset", lineLength);
  // }

  // var $word = $("#square");
  // var $dot = $("path#dot");

  // // prepare SVG
  // pathPrepare($word);
  // pathPrepare($dot);

  // // init controller
  // var controller = new ScrollMagic.Controller();

  // // build tween
  // var tween = new TimelineMax()
  //   .add(TweenMax.to($word, 0.9, {strokeDashoffset: 0, ease:Linear.easeNone})) // draw word for 0.9
  //   // .add(TweenMax.to($dot, 0.1, {strokeDashoffset: 0, ease:Linear.easeNone}))  // draw dot for 0.1
  //   // .add(TweenMax.to("path", 1, {stroke: "#33629c", ease:Linear.easeNone}), 0);     // change color during the whole thing

  // // build scene
  // var scene = new ScrollMagic.Scene({triggerElement: "#dot", duration: 1000, tweenChanges: true})
  //         .setTween(tween)
  //         .addTo(controller);

	$(function() {
		// $('#main').scrollex({
		//     enter: function() {

		//       // Set #foobar's background color to green when we scroll into it.
		//         $(this).css('opacity', '1');

		//     },
		//     leave: function() {

		//       // Reset #foobar's background color when we scroll out of it.
		//         $(this).css('opacity', '0.2');

		//     }
		//   });

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$nav = $('#nav'),
			$main = $('#main'),
			$navPanelToggle, $navPanel, $navPanelInner;

		// Disable animations/transitions until the page has loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			// $('.scrolly').scrolly();

		// Background.
			// $wrapper._parallax(0.925);

		// Nav Panel.

			// Toggle.
				$navPanelToggle = $(
					'<a href="#navPanel" id="navPanelToggle">Menu</a>'
				)
					.appendTo($wrapper);

				// Change toggle styling once we've scrolled past the header.
					$header.scrollex({
						bottom: '5vh',
						enter: function() {
							$navPanelToggle.removeClass('alt');
						},
						leave: function() {
							$navPanelToggle.addClass('alt');
						}
					});

			// Panel.
				$navPanel = $(
					'<div id="navPanel">' +
						'<nav>' +
						'</nav>' +
						'<a href="#navPanel" class="close"></a>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'right',
						target: $body,
						visibleClass: 'is-navPanel-visible'
					});

				// Get inner.
					$navPanelInner = $navPanel.children('nav');

				// Move nav content on breakpoint change.
					var $navContent = $nav.children();

					skel.on('!medium -medium', function() {

						// NavPanel -> Nav.
							$navContent.appendTo($nav);

						// Flip icon classes.
							$nav.find('.icons, .icon')
								.removeClass('alt');

					});

					skel.on('+medium', function() {

						// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

						// Flip icon classes.
							$navPanelInner.find('.icons, .icon')
								.addClass('alt');

					});

				// Hack: Disable transitions on WP.
					if (skel.vars.os == 'wp'
					&&	skel.vars.osVersion < 10)
						$navPanel
							.css('transition', 'none');

		// Intro.
			var $intro = $('#intro');

			if ($intro.length > 0) {

				// Hack: Fix flex min-height on IE.
					if (skel.vars.browser == 'ie') {
						$window.on('resize.ie-intro-fix', function() {

							var h = $intro.height();

							if (h > $window.height())
								$intro.css('height', 'auto');
							else
								$intro.css('height', h);

						}).trigger('resize.ie-intro-fix');
					}

				// Hide intro on scroll (> small).
					skel.on('!small -small', function() {

						$main.unscrollex();

						$main.scrollex({
							mode: 'bottom',
							top: '25vh',
							bottom: '-50vh',
							enter: function() {
								$intro.addClass('hidden');
							},
							leave: function() {
								$intro.removeClass('hidden');
							}
						});

					});

				// Hide intro on scroll (<= small).
					skel.on('+small', function() {

						$main.unscrollex();

						$main.scrollex({
							mode: 'middle',
							top: '15vh',
							bottom: '-15vh',
							enter: function() {
								$intro.addClass('hidden');
							},
							leave: function() {
								$intro.removeClass('hidden');
							}
						});

				});

			}

	});
// Intro.
      var $intro = $('#intro');
      var $window = $(window),
      $body = $('body'),
      $wrapper = $('#wrapper'),
      $header = $('#header'),
      $nav = $('#nav'),
      $main = $('#main'),
      $navPanelToggle, $navPanel, $navPanelInner;

      if ($intro.length > 0) {

        // Hack: Fix flex min-height on IE.
          if (skel.vars.browser == 'ie') {
            $window.on('resize.ie-intro-fix', function() {

              var h = $intro.height();

              if (h > $window.height())
                $intro.css('height', 'auto');
              else
                $intro.css('height', h);

            }).trigger('resize.ie-intro-fix');
          }

        // Hide intro on scroll (> small).
          skel.on('!small -small', function() {

            $main.unscrollex();

            $main.scrollex({
              mode: 'bottom',
              top: '25vh',
              bottom: '-50vh',
              enter: function() {
                $intro.addClass('hidden');
              },
              leave: function() {
                $intro.removeClass('hidden');
                $('.logo').css("background-color", "yellow");
              }
            });

          });

        // Hide intro on scroll (<= small).
          skel.on('+small', function() {

            $main.unscrollex();

            $main.scrollex({
              mode: 'middle',
              top: '15vh',
              bottom: '-15vh',
              enter: function() {
                $intro.addClass('hidden');
              },
              leave: function() {
                $intro.removeClass('hidden');
              }
            });

        });

      }

})(jQuery);