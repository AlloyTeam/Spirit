(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = "js-loading-" + lines;

            if (!cache[name] && lines > 0) {

                var rule = "",
                    percentage;

                rule += "@" + cssPrefix + "keyframes " + name + "{";
                for (var i = 0; i <= lines; i++) {
                    percentage = i/lines;
                    rule += percentage*100 + "%{" + cssPrefix + "transform:rotate(" + percentage*360 + "deg)}";
                }
                rule += "}";

                sheet.insertRule(rule, sheet.cssRules.length);
                
                cache[name] = true;     //缓存
            }

            return name;
        },
        _render: function(){
            if($.env && $.env.isPoorDevice){
                ratio = 1;
            }

            var options = this.options;

            var size = options.size * ratio,
                halfSize = size/2;
                inner = halfSize * (1/3) ;
                outer = halfSize * (2/3) ;
                lineWidth = options.lineWidth * ratio,
                lines = options.lines;

            this.$el.attr({ width: size, height: size });
            var ctx = this.$el[0].getContext("2d");

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';

            ctx.clearRect(0, 0, size, size);

            ctx.translate(halfSize, halfSize);

            for (var i = 0, l = lines; i < l; i++) {
                ctx.rotate(Math.PI * 2 / lines);

                ctx.strokeStyle = "rgba(" + options.color + "," + ( i < (1/4 * l) ? 1/4 : i/l )  + ")";

                ctx.beginPath();

                ctx.moveTo(0, inner);
                ctx.lineTo(0, outer);

                ctx.stroke();
            }

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);
