// ==UserScript==
// @name         Boardgamegeek Forum Hotkeys
// @namespace    https://github.com/bnesbit/boardgamegeek
// @version      1.0
// @description  Add hot keys to navigate and use Boardgamegeek.com's forums
// @author       Barry Nesbit
// @match        https://boardgamegeek.com/*
// @grant        none
// @run-at       document-end
// @require https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?7e022
// ==/UserScript==

/*
== Hot Keys ==

-- Navigation hot keys --

t - go to the first article on the page (top)
b - go to the last article on the page (bottom)
j - go to the next article in the thread
k - go to the previous article in the thread


-- Action hot keys --

q q - quick quote
q r - quick reply
r - reply

-- Misc hot keys --

q t - toggle quote blocks (quote blocks are hidden by default)

-- Deactivated/broken hotkeys

f - go to first page in the thread
l - go to the last page in the thread



*/

// disable href on images (prevents external maps from loading by accidental clicks)
/*
$('a[href^="/image/"]').on("click", function (e) {
    e.preventDefault();
});
*/


(function() {
    'use strict';

    // quotes
    const quotes = document.getElementsByClassName('quote');
    const quotetitles = document.getElementsByClassName('quotetitle');
    toggle(quotes, 'quote');
    toggle(quotetitles, 'quotetitle');

    // toggle quotes
    Mousetrap.bind('q t', () => {
        toggle(quotes, 'quotes');
        toggle(quotetitles, 'quotetitles');
    });

    // hot keys
    const articles = document.getElementsByClassName('article');
    const threadId = articles[articles.length-1].dataset.parent_objectid;
    const articleId = articles[articles.length-1].dataset.objectid;

    // navigate articles
    location.hash = '';
    let articleIndex = -1;
    let articleIds = [];
    var url = 'https://boardgamegeek.com';
    var path = window.location.pathname;
    var page = path.match(/\/page\/(\d*)$/);
    if (page) {
        page = page[1];
    } else {
        page = 0;
    }
    for ( var i = 0; i < articles.length; i++ ) {
        articleIds.push(articles[i].dataset.objectid);
    }

    /*
    // first page
    Mousetrap.bind('f', () => {
        if (page > 1) {
            path = path.replace(/\d*$/,1);
            window.location.href = 'https://boardgamegeek.com' + path;
        }
    });

    // last page
    Mousetrap.bind('l', () => {
        var pages = document.getElementsByClassName('pager')[0].children.length-3;
        if (pages != page) {
            path = path.replace(/\d*$/,pages);
            window.location.href = 'https://boardgamegeek.com' + path;
        }
    });
    */

    Mousetrap.bind('t', () => {
        articleIndex = 0;
        location.hash = articleIds[articleIndex];
    });

    Mousetrap.bind('b', () => {
        articleIndex = articleIds.length-1;
        location.hash = articleIds[articleIndex];
    });

    Mousetrap.bind('j', () => {
        if (articleIndex < 0) {
            articleIndex = 0;
        } else if (articleIndex < articleIds.length) {
            articleIndex++;
        }
        location.hash = articleIds[articleIndex];
    });

    Mousetrap.bind('k', () => {
        if (articleIndex < 0) {
            articleIndex = articleIds.length-1;
        } else if (articleIndex > 0) {
            articleIndex--;
        }
        location.hash = articleIds[articleIndex];
    });

    // quick reply
    Mousetrap.bind('q r', () => {
        QuickReply( threadId, articleId, 0 );
        window.scrollTo(0,document.body.scrollHeight);
    });

    // quick quote
    Mousetrap.bind('q q', () => {
        QuickReply( threadId, articleId, 1 );
        window.scrollTo(0,document.body.scrollHeight);
    });

    // reply
    Mousetrap.bind('r', () => {
        window.location.href = 'https://boardgamegeek.com/article/reply/' + articleId;
    });

})();

function toggle(elements, className) {
    let display = elements[0].style.display;
    display === '' ? display = 'none' : display = '';
    for ( var i = 0; i < elements.length; i++ ) {
        elements[i].style.display = display;
    }
}
