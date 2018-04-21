let shortcode = require('shortcode-parser');

module.exports = () => {

    /**
     *   [row class=ohter]
     *     [col num=6 class=custom]
     *   ## column 6
     *   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam ad doloremque,
     *     [/col]
     *     [col num=6]
     *   ## column 6
     *   Lorem ipsum dolor sit amet, consectetur adipisicing elit.
     *     [/col]
     *   [/row]
     */
    shortcode.add('row', function(element, options) {
        let cls = (options.class) ? options.class : '';
        return '<div class="row ' + cls + '">' + element + '</div>';
    });
    shortcode.add('col', function(element, options) {
        let num = (options.num) ? options.num : '',
            cls = (options.class) ? options.class : '';
        return '<div class="col-sm-' + num + ' col-md-' + num + 'col-lg-' + num + ' ' + cls + '">' + element + '</div>';
    });


    /**
     *  [video type="video/mp4" src="//monchovarela.es" poster='']
     */
    shortcode.add('video', function(element, options) {
        let type = (options.type) ? options.type : 'video/mp4',
            src = (options.src) ? options.src : '',
            cls = (options.class) ? options.class : '',
            poster = (options.poster) ? options.poster : '',
            autoplay = (options.autoplay) ? 'autoplay' : '',
            controls = (!options.controls) ? '' : 'controls';
        return '<div class="' + cls + '"><video ' + autoplay + ' ' + controls + ' name="media"><source src="' + src + '" type="' + type + '"></video></div>';
    });

    /**
     *  [button type="primary" url="http://monchovarela.es"] button [/button]
     */
    shortcode.add('button', function(element, options) {
        let type = (options.type) ? options.type : '';
        let url = (options.url) ? options.url : '';
        return '<a href="' + url + '" class="btn btn-' + type + '">' + element + '</a>';
    });


    /**
     *  [card title='This is a title'] this is a body [/card]
     *  [card img='//images.jpg' title='This is a title'] this is a body [/card]
     */
    shortcode.add('card', function(element, options) {
        let title = (options.title) ? options.title : '';
        let img = (options.img) ? '<img class="card-img-top" title="' + title + '" src="' + options.img + '"/>' : '';
        return '<div class="card mb-3">' + img + '<div class="card-header">' + title + '</div><div class="card-body">' + element + '</div></div>'
    });


    /**
     *  [style] css style [/style]
     */
    shortcode.add('style', function(element, options) {
        return '<style rel="stylesheet">' + element + '</style>';
    });
    /**
     *  [big] text here [/big]
     *  [big color=blue] text here [/big]
     */
    shortcode.add('big', function(element, options) {
        let color = (options.color) ? options.color : 'black';

        let html = '<div>';
        html += '<span style="font-size: 200%; color:' + color + ';">' + element[0] + '</span>';
        html += '<span>' + element.substring(1) + '</span>';
        html += '</div>';
        return html;
    });
    /**
     *  [color name=red] text here [/color]
     */
    shortcode.add('color', function(element, options) {
        let color = (options.name) ? options.name : 'red';
        return '<span style="color:' + color + '">' + element + '</span>';
    });

    /**
     *  [blue] text here [/blue]
     */
    shortcode.add('blue', function(element, options) {
        return '<em style="color:blue">' + element + '</em>';
    });

    /**
     *  [red] text here [/red]
     */
    shortcode.add('red', function(element, options) {
        return '<em style="color:red">' + element + '</em>';
    });

    /**
     *  [green] text here [/green]
     */
    shortcode.add('green', function(element, options) {
        return '<em style="color:green">' + element + '</em>';
    });

    /**
     *  [yellow] text here [/yellow]
     */
    shortcode.add('yellow', function(element, options) {
        return '<em style="color:yellow">' + element + '</em>';
    });

    /**
     *  [pink] text here [/pink]
     */
    shortcode.add('pink', function(element, options) {
        return '<em style="color:pink">' + element + '</em>';
    });


    /**
     *  [note] text here [/note]
     *  [note class=note] text here [/note]
     *  [note background=red padding=1em color=white] text here [/note]
     */
    shortcode.add('note', function(element, options) {
        let cls = (options.class) ? 'class="' + options.class + '"' : 'class="bg-info text-dark p-3"';
        return '<div ' + cls + '>' + element + '</div>';
    });

    /**
     *  [youtube id=pakñjalsdf class=responsive]
     */
    shortcode.add('youtube', function(element, options) {
        let cls = (options.class) ? 'class="' + options.class + '"' : 'embed-responsive',
            id = (options.id) ? options.id : '';

        if (id) return '<div ' + cls + '><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></div>';
    });
}