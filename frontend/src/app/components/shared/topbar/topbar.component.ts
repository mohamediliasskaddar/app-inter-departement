import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ProfileComponent } from '../../pages/users/profile/profile.component';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent  {

  constructor(private dialog : MatDialog ) { }

 

  openCreateProfileDialog(): void {
      const dialogRef = this.dialog.open(ProfileComponent, {
        width: '600px', // or 80%, 500px, etc.
        disableClose: true, // Prevent click-outside to close
        panelClass: 'pub-dialog'
      });
  
      dialogRef.afterClosed().subscribe(result => {
      
      });
    }
    
}
