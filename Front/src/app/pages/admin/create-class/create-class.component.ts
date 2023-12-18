import { Component, OnInit } from '@angular/core';
import { LopHocPhan } from '../../../models/lophocphan';
import { SinhvienService } from '../../../services/sinhvien.service';
import { Router } from '@angular/router';
import { MonHoc } from '../../../models/monhoc';
import { GiaoVien } from '../../../models/giaovien';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent implements OnInit{

  constructor(private lopHocPhanService: SinhvienService, private router: Router){}

  ngOnInit(): void {
    this.loadMonHocs();
    this.loadGiaoViens();
  }
  addLopHocPhanRequest: LopHocPhan = {
    maLHP: '',
    maMH: '',
    maGV: '',
    thu: '',
    gio: '', 
    isEditing: undefined
  };
  monhocs: MonHoc[] = [];
  loadMonHocs(){
    this.lopHocPhanService.getMonHocs().subscribe((result: MonHoc[]) => (this.monhocs = result));
  }
  giaoviens: GiaoVien[] = [];
  loadGiaoViens(){
    this.lopHocPhanService.getGiaoViens().subscribe((result: GiaoVien[]) => (this.giaoviens = result));
  }
  checkTimeGVExists(maGV: string, thu: string, gio: string): Observable<boolean> {
    return this.lopHocPhanService.checkTimeGVExists(maGV, thu, gio);
  }

  maLHPExists: boolean = false;
  timeGVExists: boolean = false;
  errorMessage: string = '';
  addLopHocPhan() {
    if (!this.addLopHocPhanRequest.maLHP) {
      console.error("Mã lớp học phần không hợp lệ!");
      return;
    }
  
    // Kiểm tra giờ dạy của giáo viên trước khi thêm Lớp Học Phần
    this.checkTimeGVExists(this.addLopHocPhanRequest.maGV, this.addLopHocPhanRequest.thu, this.addLopHocPhanRequest.gio)
      .subscribe({
        next: (isTimeConflict) => {
          if (isTimeConflict) {
            this.errorMessage = "Giáo viên đã trùng giờ dạy!";
          } else {
            this.lopHocPhanService.checkMaLHPExists(this.addLopHocPhanRequest.maLHP).subscribe({
              next: (exists) => {
                this.maLHPExists = exists;
                if (exists) {
                  console.log("Mã lớp học phần đã tồn tại!");
                  this.errorMessage = "Mã lớp học phần đã tồn tại!";
                } else {
                  this.lopHocPhanService.addLopHocPhan(this.addLopHocPhanRequest).subscribe({
                    next: (lophocphan) => {
                      this.router.navigate(['/admin-class']);
                    }
                  });
                }
              },
            });
          }
        },
      });
  }


}
