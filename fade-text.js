var fadeSlide;

fadeSlide = function(obj, text, callback) {
var c, _i, _len, _results;
obj.html('');
recFade = function(i) {
   if(i >= text.length) {
       callback();
   } else {
     c = text[i];
     obj.append("<span>" + c + "</span>");
     $(obj.find("span").get(i)).hide();
     $(obj.find("span").get(i)).fadeIn(800);
     setTimeout(function() {
         i++;
         recFade(i);
     }, 100);
  };
};
recFade(0);
};

