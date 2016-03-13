/**
 * @license 
 * Copyright (c) 2016, Immo Schulz-Gerlach, www.isg-software.de 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are 
 * permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


( function($) {

	function rad(opts) {
	//TODO In Readme / API dokumentieren, dass im Fall ringWidth undefined strokeWidth von radius abgezogen wurde und was totalRadius ist.
		if (typeof opts.pieOpts.ringWidth === "undefined" || opts.fullSize) {
			return opts.totalRadius;
		} else {
			var r = opts.radius;
			if (opts.backgroundColor) {
				r -= opts.gapToRing;
			}
			return r;
		}
	}

	function addBackground(opts, r) {
		//fill background if set
		if (opts.backgroundColor) {
			var bg = opts.newSvgElement("circle");
			bg.setAttribute("cx", "0");
			bg.setAttribute("cy", "0");
			
			bg.setAttribute("r", r);
			bg.setAttribute("fill", opts.backgroundColor);
		}
	}

	/**
	 * TODO REWRITE JSDOC!
	 * SVG Content Plug-in for jquery-progresspiesvg: Does nothing for values less than 100%, but draws a check mark / tick onto the 
	 * fully filled pie resp. inside the full ring for a value of 100%.
	 * Use by adding the option <code>contentPlugin: "checkComplete"</code> (or <code>contentPlugin: $.fn.progressPie.contentPlugin.checkComplete</code>)
	 * to your call of the progresspie plug-in.
	 * <p>Additional arguments may be supplied by adding the option <code>contentPluginOptions</code> to the progressPie plugin options.
	 * This is to be an object which may hold the following properties:</p>
	 * <ul>
	 * <li><code>strokeWidth</code>: Defaults to 2. Width of the stroke for the check mark (not equal to the strokeWidth option of the pie chart (outer circle)</li>
	 * <li><code>lineCap</code>: Defaults to "round", may take any value allowed for the SVG line-cap style, like "square".</li>
	 * <li><code>color</code>: draw the check mark in a specific color (defaults to the color of the surrounding ring chart resp. to white on a pie chart).</li>
	 * <li><code>animate</code>: boolean or string with duration (number and time unit): If true or string, an animation drawing the check (from left to right) will be added.
	 * If the value is a string, it has to be a valid duration value defining the speed of the animation. If "true", the default duration (1s) will be applied.</li>
	 * <li><code>contentPlugin</code> and <code>contentPluginOptions</code>: These options are ignored vor a value of 100%, i.e. in case the check mark gets drawn as
	 * content for the progress pie. But if set, this content plug-in will delegate to the alternative content plug-in stated here-in for any percent value less than 100%.
	 * I.e.: This plug-in will decide if the percent value is 100 or less, in the first case drawing the check mark as content, while in the second case, i.e. for any percent
	 * value in 0..99, the content of this "secondary" plug-in will be added to the pie/ring chart.</li>
	 * </ul>
	 * <p>Please note: This function is called <em>internally</em> by the progressPie jQuery plug-in! Don't call this function directly,
	 * but use it as desrcibed above!</p>
	 * @function checkComplete
	 * @param {object} args object holding several arguments provided by the progressPie plug-in, including any option you specified in
	 * the object <code>contentPluginOptions</code>.
	 * @memberof jQuery.fn.progressPie.contentPlugin
	 * @requires jquery-progresspiesvg-min.js
	 */
	$.fn.progressPie.contentPlugin.cross = function(args) {
		var opts = $.extend({}, $.fn.progressPie.contentPlugin.crossDefaults, args);
		var r = rad(opts); 
		addBackground(opts, r);	
	
		var icon = args.newSvgElement("path");
		var r2 = r / 2.5;

		var start = "M-" + r2 + ",-" + r2 + " ";
		var line1 = "L" + r2 + "," + r2 + " ";
		var move  = "M-" + r2 + "," + r2 + " ";
		var line2 = "L" + r2 + ",-" + r2;
		icon.setAttribute("d", start + line1 + move + line2);
		icon.setAttribute("style", "stroke-width: " + opts.strokeWidth + "; stroke-linecap: " + opts.lineCap + "; stroke: " + opts.iconColor + "; fill: none");
		if (opts.animate) {
			var anim = args.newSvgSubelement(icon, "animate");
			anim.setAttribute("attributeName", "d");
			anim.setAttribute("dur", typeof opts.animate === "string" ? opts.animate : "1s");
			anim.setAttribute("repeatCount", "1");
			anim.setAttribute("values", start + "l0,0 m0,0 l0,0; " + start + line1 + "m0,0 l0,0; " + start + line1 + move + " l0,0; " + start + line1 + move + line2);
			anim.setAttribute("calcMode", "spline");
			anim.setAttribute("keyTimes", "0; .45; .55; 1");
			anim.setAttribute("keySplines", ".5 0 .3 1; 1 0 0 1; .3 0 0 1");
		}
	};
	
	$.fn.progressPie.contentPlugin.exclamationMark = function(args) {
		var opts = $.extend({}, $.fn.progressPie.contentPlugin.crossDefaults, args);
		var r = rad(opts); 
		addBackground(opts, r);	
	
		var icon = args.newSvgElement("path");
		var r2 = r / 2;

		var start = "M0,-" + r2 + " ";
		var line1 = "L0, " + (r2 - (opts.strokeWidth < 2 ? 3 : 1.5 * opts.strokeWidth));
		var move  = "M0," + r2 + " ";
		var line2 = "L0," + (r2 - (opts.strokeWidth < 2 ? 1 : 0));
		icon.setAttribute("d", start + line1 + move + line2);
		icon.setAttribute("style", "stroke-width: " + opts.strokeWidth + "; stroke-linecap: " + opts.lineCap + "; stroke: " + opts.iconColor + "; fill: none");
		if (opts.animate) {
			var anim = args.newSvgSubelement(icon, "animate");
			anim.setAttribute("attributeName", "d");
			anim.setAttribute("dur", typeof opts.animate === "string" ? opts.animate : "1s");
			anim.setAttribute("repeatCount", "1");
			anim.setAttribute("values", start + "l0,0 " + start + "l0,0 ; " + start + line1 + start + line1 + "; " + start + line1 + move + " l0,0; " + start + line1 + move + line2);
			anim.setAttribute("calcMode", "spline");
			anim.setAttribute("keyTimes", "0; .6; .8; 1");
			anim.setAttribute("keySplines", ".5 0 .3 1; 1 0 0 1; .3 0 0 1");
		}
	};
	
	/**
	 * Default Options.
	 * This is a public (static) object in order to allow users to globally modify the defaults
	 * before using the <code>checkComplete</code> content plug-in.
	 * @member checkCompleteDefaults
	 * @memberof jQuery.fn.progressPie.contentPlugin
	 * @property {number} strokeWidth - Width of the stroke the check mark is drawn width, defaults to 2.
	 * @property {string} lineCap - Value for SVG style property "line-cap" defining the look of the line ends of the check mark. Defaults to "round".
	 */
	$.fn.progressPie.contentPlugin.crossDefaults = {
		iconColor: "white",
		backgroundColor: "red",
		strokeWidth: 2,
		lineCap: "round",
		gapToRing: 1
	};

} (jQuery));