import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { Subscription, interval } from 'rxjs';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
}

interface ChatContact {
    id: string;
    name: string;
    role: string;
    avatar: string;
    online: boolean;
    messages: Message[];
    isTyping?: boolean;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrls: ['./chat.css']
})
export class Chat implements OnInit, OnDestroy {

    auth = inject(AuthService);
    http = inject(HttpClient);

    @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

    // ✅ SIGNALS
    newMessage = signal('');
    contacts = signal<ChatContact[]>([]);
    activeContact = signal<ChatContact | null>(null);
    myEmail = signal('');

    private pollSub?: Subscription;

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('CurrentUser') || '{}');
        this.myEmail.set(user?.email || '');

        this.loadContacts();

        // Poll every 3 sec
        this.pollSub = interval(3000).subscribe(() => {
            const active = this.activeContact();
            if (active) {
                this.loadHistory(active, false);
            }
        });
    }

    ngOnDestroy() {
        this.pollSub?.unsubscribe();
    }

    // ================= CONTACTS =================
    loadContacts() {
        this.http.get<any[]>('https://backend-6fko.onrender.com/api/messages/contacts').subscribe({
            next: (users) => {
                const mapped: ChatContact[] = users.map(u => ({
                    id: u.email,
                    name: u.fullName + (u.role ? ` (${u.role})` : ''),    
                    role: u.role,     
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=16a34a&color=fff`,
                    online: true,
                    messages: [] as Message[]
                }));

                // new
                this.contacts.set(mapped);

                if (mapped.length > 0) {
                    this.selectContact(mapped[0]);
                }
            }
        });
    }
  // new over

    // ================= HISTORY =================
    loadHistory(contact: ChatContact, scroll = true) {
        if (contact.id === 'ai-bot') return;

        this.http.get<any[]>(`https://backend-6fko.onrender.com/api/messages/history/${contact.id}`).subscribe({
            next: (msgs) => {
                contact.messages = msgs.map(m => ({
                    id: m.id,
                    text: m.content,
                    sender: m.senderEmail === this.myEmail() ? 'me' : 'other',
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                this.contacts.update(list => [...list]); // trigger UI refresh

                if (scroll) this.scrollToBottom();
            }
        });
    }

    // ================= SELECT =================
    selectContact(contact: ChatContact) {
        this.activeContact.set(contact);
        this.loadHistory(contact, true);
    }

    // ================= SEND =================
    sendMessage() {
        const text = this.newMessage().trim();
        const active = this.activeContact();

        if (!text || !active) return;

        this.newMessage.set('');

        // AI BOT
        if (active.id === 'ai-bot') {
            active.messages.push({
                id: Date.now(),
                text,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            active.isTyping = true;
            this.contacts.update(list => [...list]);
            this.scrollToBottom();

            setTimeout(() => {
                active.isTyping = false;
                active.messages.push({

                    id: Date.now(),
                    text: '🤖 Smart farming advice coming soon!',
                    sender: 'other',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });

                this.contacts.update(list => [...list]);
                this.scrollToBottom();
            }, 1500);
             
            return;
        }

        // BACKEND
        const payload = {
            receiverEmail: active.id,
            content: text
        };

        this.http.post<any>('https://backend-6fko.onrender.com/api/messages', payload).subscribe({
            next: (m) => {
                active.messages.push({
                    id: m.id,
                    text: m.content,
                    sender: 'me',
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });

                this.contacts.update(list => [...list]);
                this.scrollToBottom();
            }
        });
    }

    // ================= SCROLL =================
    private scrollToBottom() {
        setTimeout(() => {
            try {
                this.chatScrollContainer.nativeElement.scrollTop =
                    this.chatScrollContainer.nativeElement.scrollHeight;
            } catch { }
        }, 100);
    }
}
