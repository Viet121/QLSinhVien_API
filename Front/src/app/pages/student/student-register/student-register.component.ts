import { NgIfContext } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapPhep } from 'src/app/models/capphep';
import { KetQua } from 'src/app/models/ketqua';
import { LopHocPhan } from 'src/app/models/lophocphan';
import { InforService } from 'src/app/services/infor.service';
import { SinhvienService } from 'src/app/services/sinhvien.service';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit{

  lophocphans: LopHocPhan[] = [];
  lophocphan2s: LopHocPhan[] = [];
  public role!:string;
  public fullName!:string;
  public email!: string;
  errorMessage: string = '';
  capPhep : CapPhep ={
    maCP: '',
    tenCP: '',
    tinhTrang: 0
  }
  addKQuaRequest : KetQua = {
    maSV: '',
    maLHP: '',
    diem: undefined
  };
closedState: TemplateRef<NgIfContext<boolean>> | null | undefined;
  constructor(private route: ActivatedRoute,private lopHocPhanService: SinhvienService,private inforService : InforService, private router: Router){}

  ngOnInit(): void {
    this.loadCapPhep();
    this.loadLopHocPhans();
    this.inforService.getName()
    .subscribe(val=>{
      const fullNameFromToken = this.lopHocPhanService.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.inforService.getRole()
    .subscribe(val=>{
      const roleFromToken = this.lopHocPhanService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.inforService.getEmail()
    .subscribe(val=>{
      const emailFromToken = this.lopHocPhanService.getEmailFromToken();
      this.email = val || emailFromToken;
    });

    this.loadLopHocPhan2s(this.email);
  }

  loadCapPhep(){
    this.lopHocPhanService.getCapPhep('DKHP').subscribe({
      next: (response) => {
        this.capPhep = response;
      }
    });
  }

  loadLopHocPhans(){
    this.lopHocPhanService.getLopHocPhanMonHocGiaoVienInfo().subscribe((result: LopHocPhan[]) => (this.lophocphans = result));
  }
  loadLopHocPhan2s(maSV: string){
    this.lopHocPhanService.getKetQuaDetailsByStudent(maSV).subscribe((result: LopHocPhan[]) => (this.lophocphan2s = result));
  }

  deleteRegister(maLHP:string, maSV: string) {
    console.log(maLHP);
    console.log(maSV);
    const confirmation = window.confirm('Bạn có muốn hủy học phần này không !');
    if (confirmation) {
      this.lopHocPhanService.deleteKQua(maLHP,maSV).subscribe({
        next: (response) => {
          this.loadLopHocPhan2s(this.email);
        }
      });
    }
  }
  
  register(maLHP:string, maSV: string, maMH:string, thu:string, gio:string){
    this.addKQuaRequest.maLHP = maLHP;
    this.addKQuaRequest.maSV = maSV;
    this.lopHocPhanService.checkClassSVExists(maLHP,maSV).subscribe({
      next: (isClassConflict) => {
        if(isClassConflict){
          this.errorMessage = "Lớp học phần này đã đăng ký!";
        } else{
          this.lopHocPhanService.checkSubjectSVExists(maSV,maMH).subscribe({
            next: (isSubjectConflict) => {
              if(isSubjectConflict){
                this.errorMessage = "Môn học này đã đăng ký!";
              } else{
                this.lopHocPhanService.checkTimeSVExists(maSV,thu,gio).subscribe({
                  next: (isTimeConfict) => {
                    if(isTimeConfict){
                      this.errorMessage = "Lớp học phần này đã trùng lịch!";
                    }else{
                      this.lopHocPhanService.addKQua(this.addKQuaRequest).subscribe({
                        next: (response) => {
                          this.loadLopHocPhan2s(this.email);
                        }    
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }

  logOut(){
    this.lopHocPhanService.logOut();
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
  
  searchText: string = '';
  isSearching: boolean = false;
  search(maLHP: string) {
    this.isSearching = true;
    if (maLHP) {
      this.lopHocPhanService.getLopHocPhanMonHocGiaoVienInfoByPartial(maLHP).subscribe((result: LopHocPhan[]) => (this.lophocphans = result));
    } else {
      this.loadLopHocPhans();
    }
  }

}
