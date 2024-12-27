(()=>{
    document.addEventListener('DOMContentLoaded', function(){
      document.querySelector('#year').textContent = new Date().getFullYear();
    });
})();