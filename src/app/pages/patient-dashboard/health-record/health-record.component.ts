import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-health-record',
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.css']
})
export class HealthRecordComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private shirtImage = new Image();
  private readonly REMOVE_BG_API_KEY = 'YOUR_REMOVE_BG_API_KEY'; // <-- Thay bằng API Key của bạn

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.shirtImage.src = 'assets/images/shirt.png';
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    try {
      const imageWithoutBgBlob = await this.removeBackground(file);

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          this.ctx.clearRect(0, 0, 300, 400);
          this.ctx.drawImage(img, 0, 0, 300, 400); // Ảnh đã xóa nền

          // Nếu áo sơ mi đã load
          if (this.shirtImage.complete) {
            this.ctx.drawImage(this.shirtImage, 0, 0, 300, 400);
          } else {
            this.shirtImage.onload = () => {
              this.ctx.drawImage(this.shirtImage, 0, 0, 300, 400);
            };
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(imageWithoutBgBlob);
    } catch (error) {
      console.error('Xóa nền thất bại:', error);
      alert('Lỗi xóa nền. Kiểm tra API key hoặc thử lại sau.');
    }
  }

  private async removeBackground(imageFile: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'auto');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': this.REMOVE_BG_API_KEY,
        },
        responseType: 'blob',
      }
    );

    return response.data;
  }
}
