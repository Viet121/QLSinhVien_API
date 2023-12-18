import { Component, OnInit } from '@angular/core';
import { GiaoVien } from '../../../models/giaovien';
import { ActivatedRoute, Router } from '@angular/router';
import { SinhvienService } from '../../../services/sinhvien.service';
import { InforService } from 'src/app/services/infor.service';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.css']
})
export class AdminTeacherComponent implements OnInit{
  currentPage: number = 1; 
  giaoviens: GiaoVien[] = [];
  public role!:string;
  public fullName!:string;
  constructor(private route: ActivatedRoute,private sinhVienService: SinhvienService,private inforService : InforService, private router: Router){}

  ngOnInit(): void {
    this.loadGiaoViens();
    this.inforService.getName()
    .subscribe(val=>{
      const fullNameFromToken = this.sinhVienService.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.inforService.getRole()
    .subscribe(val=>{
      const roleFromToken = this.sinhVienService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }
  logOut(){
    this.sinhVienService.logOut();
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

  loadGiaoViens(){
    this.sinhVienService.getGiaoViens().subscribe((result: GiaoVien[]) => (this.giaoviens = result));
  }

  deleteUserForm(email: string){
    this.sinhVienService.deleteUserForm(email).subscribe({
      next: (response) => {
        this.router.navigate(['/admin-teacher']);
        this.loadGiaoViens();
      }
    });
  }

  deleteGiaoVien(maGV: string) {
    const confirmation = window.confirm('Bạn có muốn xoá giáo viên này không !');
    if (confirmation) {
      // Nếu người dùng xác nhận xóa, thì thực hiện hàm delete
      this.sinhVienService.deleteGiaoVien(maGV).subscribe({
        next: (response) => {
          this.deleteUserForm(maGV);
        }
      });
    }
  }

  searchText: string = '';
  isSearching: boolean = false;
  searchGiaoVien(maGV: string) {
    this.isSearching = true;
    if (maGV) {
      this.sinhVienService.getGiaoVienByMaGV(maGV).subscribe((result: GiaoVien[]) => (this.giaoviens = result));
    } else {
      // If the search query is empty, load the full list of students.
      this.loadGiaoViens();
    }
  }

}

