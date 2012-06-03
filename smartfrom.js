smartFrom = {
  getEmailDomain: function(strEmail) {
    var domain = null;
    strEmail.replace(
      new RegExp( "^(.+)@(.+)\\.(\\w+)$" , "i" ),

      // Send the match to the sub-function.
      function( $0, $1, $2, $3 ){
        domain = $2 + '.' + $3;
      }
    );

    return domain;
  },
  parseEmailAddresses: function(str) {
    emailRegex = /(?:"([^"]+)")? ?<?(.*?@[^>,]+)>?,? ?/g;
    results = $([]);

    $(str.toString().split(',')).map(function() {
      match = emailRegex.exec(this);

      if (match) {
        results.push(smartFrom.getEmailDomain(match[2]));
      }
    });
    return results;
  },
  init: function() {
    iframe = $("#canvas_frame").contents();
    toField = iframe.find('textarea[name="to"]');
    selectField = iframe.find('select[name="from"]');
    options = selectField.children('option');

    fromEmails = {};
    options.map(function() { 
      fromEmails[smartFrom.parseEmailAddresses(this.value)[0]] = this.value;
    });

    toField.blur(function() {
      toEmails = smartFrom.parseEmailAddresses(this.value);

      toEmails.each(function() {
        toEmail = this;
        matchedFromEmail = fromEmails[toEmail];

        if (matchedFromEmail) {
          option_to_select = options.filter(function() {
            return this.value == matchedFromEmail;
          });

          options.each(function() {
            $(this).attr('selected', null);
          });

          option_to_select.attr('selected', 'selected');
        }
      });
    });
  }
}

$(document).ready(function() {
  smartFrom.init();
});
