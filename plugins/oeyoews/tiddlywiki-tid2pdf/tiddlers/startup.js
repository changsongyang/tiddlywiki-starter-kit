/*\
title: tid2pdf/startup.js
type: application/javascript
module-type: startup

tid2pdf module

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports.name = 'tid2pdf-startup-hook';
  exports.platforms = ['browser'];
  exports.after = ['load-modules'];
  exports.synchronous = true;
  exports.startup = () => {
    window.jspdf = require('jspdf.umd.min.js');
    window.html2canvas = require('html2canvas.min.js');
    window.htmlToImage = require('html-to-image.min.js');

    $tw.rootWidget.addEventListener('om-export-plus', event => {
      // add adjuge
      const paramObject = event.paramObject || {};
      // NOTE: this tid must have storylist be rendered by tw
      const title =
        paramObject.title || $tw.wiki.getTiddlerText('$:/temp/focussedTiddler');
      const selector = `[data-tiddler-title="${title}"]`;

      var node = document.querySelector(selector);

      htmlToImage
        .toSvg(node)
        .then(function (dataUrl) {
          var img = new Image();
          img.src = dataUrl;

          const linkNode = document.createElement('a');
          linkNode.href = imgData;

          // 指定文件名并将<a>元素添加到页面上
          linkNode.download = `${title}`;
          document.body.appendChild(linkNode);

          // 模拟单击事件以触发下载
          linkNode.click();

          // 将<a>元素从页面上移除
          document.body.removeChild(linkNode);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    });

    $tw.rootWidget.addEventListener('om-export-png', event => {
      // add adjuge
      const paramObject = event.paramObject || {};
      // NOTE: this tid must have storylist be rendered by tw
      const title =
        paramObject.title || $tw.wiki.getTiddlerText('$:/temp/focussedTiddler');
      const selector = `[data-tiddler-title="${title}"]`;

      var element = document.querySelector(selector);

      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png'); // 转换canvas为PNG格式的数据URL

        // 创建一个<a>元素，并指定其href属性为图像数据URL
        const linkNode = document.createElement('a');
        linkNode.href = imgData;

        // 指定文件名并将<a>元素添加到页面上
        linkNode.download = `${title}`;
        document.body.appendChild(linkNode);

        // 模拟单击事件以触发下载
        linkNode.click();

        // 将<a>元素从页面上移除
        document.body.removeChild(linkNode);
      });
    });
  };
})();
