import { Component, OnInit } from '@angular/core';
import { CapPhep } from '../../../models/capphep';
import { ActivatedRoute, Router } from '@angular/router';
import { SinhvienService } from '../../../services/sinhvien.service';
import { InforService } from 'src/app/services/infor.service';

@Component({
  selector: 'app-admin-allow',
  templateUrl: './admin-allow.component.html',
  styleUrls: ['./admin-allow.component.css']
})
export class AdminAllowComponent implements OnInit{
  cappheps: CapPhep[] = [];

  capphepDetails: CapPhep = {
    maCP: '',
    tenCP: '',
    tinhTrang: 0,
  }
  public role!:string;
  public fullName!:string;
  constructor(private route: ActivatedRoute,private capPhepService: SinhvienService,private inforService : InforService, private router: Router){}
  
  ngOnInit(): void {
    this.capPhepService.getCapPhep('DKHP').subscribe({
      next: (response) => {
        this.capphepDetails = response;
      }
    });
    this.inforService.getName()
    .subscribe(val=>{
      const fullNameFromToken = this.capPhepService.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.inforService.getRole()
    .subscribe(val=>{
      const roleFromToken = this.capPhepService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }
  
  loadCapPheps(){
    this.capPhepService.getCapPheps().subscribe((result: CapPhep[]) => (this.cappheps = result));
  }
  updateCapPhep(){
    this.capPhepService.updateCapPhep(this.capphepDetails).subscribe({
      next: (response) => {
        this.router.navigate(['/admin-allow']);
        location.reload();
      }
    });
  }
  profile(){
    if (this.role === 'admin') {
      this.router.navigate(['/admin-profile'])
    } else if (this.role === 'teacher') {
      this.router.navigate(['/teacher-profile'])
    } else {
      this.router.navigate(['/student-profile'])
    }
  }
  logOut(){
    this.capPhepService.logOut();
  }
  searchText: string = '';
  isSearching: boolean = false;
  searchCapPhep(maCP: string) {
    
  }

}
