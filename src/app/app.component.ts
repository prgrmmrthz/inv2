import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inv2';

  ngOnInit() {
    // Add active state to sidbar nav links
    $('body').keypress(function(e){ 
      if(e.which == 27){
      Swal.close();
       } 
      });

    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
  }
}
