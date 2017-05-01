define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/main/main.html'], 
  function($, _, Backbone, Marionette, mainTemplate) {
    return Marionette.View.extend({
      template: mainTemplate,
      className: 'content-wrapper', // AdminLTE 约定的class
      regions: {
        header: '.content-header',
        content: '.content'
      },
      initialize: function(options) {
        console.log('MainView is initialized.')
      },
      onRender() {
        console.log('MainView is rendered.')
      }
    })
  })