import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  skillLevel: string;
  aboutMe: string;
  teachingStyle: string;
  skillsOffered: string[];
  skillsLearning: string[];
  stats: {
    skillsOffered: number;
    skillsLearning: number;
    sessionsCompleted: number;
  };
  availability: boolean[][];
}

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  userProfile: UserProfile = {
    id: '1',
    name: 'Sarah Anderson',
    avatar: '/assets/sarah-anderson.jpg',
    gender: 'Female',
    skillLevel: 'Beginner',
    aboutMe: 'I am a versatile educator and creative professional who brings unique blend of technical and artistic expertise to my teachings. With skills spanning photography, UI/UX design, Guitar instruction, and French language, I offer a well rounded experience. Currently expanding my skill set in Javascript, Spanish, data analytics, and photography.',
    teachingStyle: 'My teaching approach is highly flexible and student centered, offering sessions ranging from 30 minutes to 1 hour to accommodate different learning preference and schedules. My availability spans throughout the week with multiple time slots, demonstrating my commitment to making learning accessible. As someone who is simultaneously teaching and learning, I bring empathy and fresh perspective to learning',
    skillsOffered: ['Photography', 'UI/UX Design', 'Guitar Lessons', 'French Language'],
    skillsLearning: ['Javascript', 'Spanish Language', 'Data Analytics', 'Photography'],
    stats: {
      skillsOffered: 12,
      skillsLearning: 8,
      sessionsCompleted: 34
    },
    availability: [
      [false, true, false, false, false, true, false], // 9am-11am
      [true, false, true, false, false, false, false], // 11am-1pm
      [false, false, false, false, false, false, false], // 1pm-3pm
      [false, false, false, false, false, false, false], // 3pm-5pm
      [false, false, false, false, false, true, false], // 5pm-7pm
      [false, false, false, false, true, false, true]  // 7pm-9pm
    ]
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      // In a real application, you would fetch user data based on the ID
      // For now, we'll use the default data
      console.log('Loading profile for user ID:', userId);
      this.loadUserProfile(userId);
    });
  }

  private loadUserProfile(userId: string): void {
    // In a real application, this would be an API call
    // For now, we'll simulate different user profiles based on ID
    if (userId === '2') {
      this.userProfile = {
        id: '2',
        name: 'Marcus Rodriguez',
        avatar: '/assets/marcus-rodriguez.jpg',
        gender: 'Male',
        skillLevel: 'Advanced',
        aboutMe: 'Experienced full stack developer with 5+ years of experience in modern web technologies. Passionate about teaching and helping others learn programming concepts.',
        teachingStyle: 'I believe in hands-on learning with real-world projects. My sessions are interactive and focused on practical application of concepts.',
        skillsOffered: ['JavaScript', 'React', 'Node.js', 'Python'],
        skillsLearning: ['Machine Learning', 'DevOps', 'Mobile Development'],
        stats: {
          skillsOffered: 8,
          skillsLearning: 5,
          sessionsCompleted: 67
        },
        availability: [
          [true, false, true, false, true, false, false], // 9am-11am
          [false, true, false, true, false, true, false], // 11am-1pm
          [true, false, true, false, true, false, true], // 1pm-3pm
          [false, true, false, true, false, true, false], // 3pm-5pm
          [true, false, true, false, true, false, true], // 5pm-7pm
          [false, true, false, true, false, true, false] // 7pm-9pm
        ]
      };
    }
    // Default profile (Sarah Anderson) is already set
  }
}
