import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  
  // Hardcoded Support/Contact details
  supportPhone = '8238775747';
  supportEmail = 'krishpr2004@gmail.com';

  getWhatsAppLink(): string {
    const text = encodeURIComponent(`Hello FarmEase Support, I need some help!`);
    return `https://wa.me/8238775747?text=${text}`;
  }

  getPhoneLink(): string {
    return `tel:+918238775747`;
  }

  getTelegramSupport(): string {
    const text = encodeURIComponent(`Telegram Suport!`);
    return `https://web.telegram.org/a/#7198886077?text=${text}`;
  }

  getMailLink(): string {
    const subject = encodeURIComponent(`FarmEase Support Request`);
    const body = encodeURIComponent(`Hi Support Team,\n\nI have a question regarding...`);
    return `mailto:${this.supportEmail}?subject=${subject}&body=${body}`;
  }




  submitMessage(event: Event) {
    event.preventDefault();
    alert('✅ Message sent to FarmEase support!');
  }
}
