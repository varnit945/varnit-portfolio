import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePresenter } from './PresenterContext';
import { 
  Code, Database, Terminal, Cpu, Layers, ExternalLink, 
  Download, Mail, Send, Award, BookOpen, Phone
} from 'lucide-react';

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const SkillBar = ({ name, level }) => {
  return (
    <div className="skill-bar-wrapper">
      <div className="skill-info">
        <span className="skill-name">{name}</span>
        <span className="skill-percentage">{level}%</span>
      </div>
      <div className="skill-bar-bg">
        <motion.div 
          className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default function PortfolioSections() {
  const { startNarrationForSection } = usePresenter();
  const [activeTab, setActiveTab] = useState('skills');

  // Intersection observers are used for animations, but no longer trigger narration, allowing continuous uninterrupted playback
  const [heroRef, heroInView] = useInView({ threshold: 0.4, triggerOnce: true });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.4, triggerOnce: true });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.4, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.4, triggerOnce: true });
  const [dsRef, dsInView] = useInView({ threshold: 0.4, triggerOnce: true });
  const [contactRef, contactInView] = useInView({ threshold: 0.4, triggerOnce: true });

  return (
    <div className="sections-container">
      
      {/* HERO SECTION */}
      <motion.section 
        id="hero"
        ref={heroRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}
      >
        <div className="badge-ai">
          <span className="badge-dot"></span>
          AI Agent Presenter Active
        </div>
        <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: '500' }}>
          Under Graduate Software Developer
        </p>
        <h1 className="title-hero" style={{ lineHeight: '1.1', marginBottom: '1rem' }}>
          Hi, I'am <span style={{ color: '#ff003c' }}>Varnit</span><br/>
          B-tech Student at UU
        </h1>
        <div className="btn-row">
          <a href="#about" className="btn-primary">
            Explore Portfolio <ExternalLink size={16} />
          </a>
          <a href="#contact" className="btn-secondary">
            Get in Touch
          </a>
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <motion.section 
        id="about"
        ref={aboutRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="glass-panel"
      >
        <div className="accent-glow-cyan"></div>
        <div className="accent-glow-purple"></div>
        
        <h2 className="section-title">
          <BookOpen className="skill-name" /> About Me
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#cbd5e1', lineHeight: '1.7' }}>
          <p>
            I am currently pursuing a B.Tech in Computer Science Engineering at Uttaranchal University, Dehradun. I completed my 10th and 12th education in my hometown, Chhutmalpur, where I built a strong academic foundation and developed a keen interest in technology. I am a curious, dedicated, and enthusiastic learner who is always eager to explore new concepts and technologies. My goal is to continuously enhance my technical skills, apply my knowledge to solve real-world problems, and contribute meaningfully to the field of computer science.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Education</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>B.Tech in Computer Science Engineering</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Interests</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Web Development, Data Analytics, AI Agents</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section 
        id="skills"
        ref={skillsRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="glass-panel"
      >
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span 
            onClick={() => setActiveTab('skills')}
            style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'skills' ? '2px solid #ff4d6d' : 'none', color: activeTab === 'skills' ? '#e2e8f0' : '#94a3b8', cursor: 'pointer', fontWeight: activeTab === 'skills' ? '500' : 'normal', transition: 'all 0.2s ease' }}
          >Skills</span>
          <span 
            onClick={() => setActiveTab('experience')}
            style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'experience' ? '2px solid #ff4d6d' : 'none', color: activeTab === 'experience' ? '#e2e8f0' : '#94a3b8', cursor: 'pointer', fontWeight: activeTab === 'experience' ? '500' : 'normal', transition: 'all 0.2s ease' }}
          >Experience</span>
          <span 
            onClick={() => setActiveTab('education')}
            style={{ paddingBottom: '0.5rem', borderBottom: activeTab === 'education' ? '2px solid #ff4d6d' : 'none', color: activeTab === 'education' ? '#e2e8f0' : '#94a3b8', cursor: 'pointer', fontWeight: activeTab === 'education' ? '500' : 'normal', transition: 'all 0.2s ease' }}
          >Education</span>
        </div>

        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Capabilities</span>
              <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0', color: 'white', fontWeight: '800' }}>Technical Skill Set</h2>
            </div>

            {/* Development Category */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem' }}>
                  <Code color="#06b6d4" size={24} />
                </div>
                Development
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {[ 
                  { name: 'HTML & CSS', level: 'Advanced' },
                  { name: 'JavaScript', level: 'Advanced' },
                  { name: 'Python', level: 'Advanced' }
                ].map((skill, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#0f172a', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal color="#94a3b8" size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{skill.name}</div>
                      <div style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        ★ {skill.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Analytics Category */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem' }}>
                  <Database color="#8b5cf6" size={24} />
                </div>
                Data Analytics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {[ 
                  { name: 'Excel', level: 'Advanced' },
                  { name: 'Power BI', level: 'Advanced' },
                  { name: 'SQL', level: 'Advanced' },
                  { name: 'Tableau', level: 'Intermediate' }
                ].map((skill, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#0f172a', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers color="#94a3b8" size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{skill.name}</div>
                      <div style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        ★ {skill.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Skills Category */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem' }}>
                  <Cpu color="#10b981" size={24} />
                </div>
                Additional Skills
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {[ 
                  { name: 'AI Agents (n8n)', level: 'Advanced' },
                  { name: 'Canva', level: 'Advanced' }
                ].map((skill, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: '#0f172a', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award color="#94a3b8" size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{skill.name}</div>
                      <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        ★ {skill.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#06b6d4', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={20} /> AI-Powered Student Productivity Dashboard (SaaS)
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                Developed an AI-Powered Student Productivity Dashboard (SaaS) that integrates an AI chatbot, Study Hub, notes management, task scheduling, habit tracking, a focus timer, mock interview preparation, code assistance, weather updates, news, file management, and intelligent search into a single platform. Designed a responsive and interactive dashboard with personalized AI assistance, real-time insights, and productivity tools to help students organize their studies, prepare for placements, manage daily tasks, and improve learning efficiency.
              </p>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} /> AI Career Analyzer
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                Developed an AI Career Analyzer that evaluates users' skills, resumes, and career goals to provide personalized career recommendations, identify skill gaps, and generate customized learning roadmaps for career growth.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ff4d6d' }}>
              <h3 style={{ color: '#ff4d6d', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} /> Undergraduate
              </h3>
              <p style={{ color: '#cbd5e1', margin: '0', fontSize: '1.1rem' }}>B.Tech in Computer Science Engineering</p>
              <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Uttaranchal University, Dehradun</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
              <h3 style={{ color: '#10b981', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} /> Schooling (10th & 12th)
              </h3>
              <p style={{ color: '#cbd5e1', margin: '0', fontSize: '1.1rem' }}>Completed from Dellmond International School</p>
            </div>
          </div>
        )}
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section 
        id="projects"
        ref={projectsRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <h2 className="section-title">
          <Terminal className="skill-name" /> Featured Projects
        </h2>
        
        {/* Project 1 */}
        <div className="project-card-modern">
          <div className="project-banner">
            <img src="./ai_dashboard_banner.png" alt="AI Productivity Dashboard Banner" />
          </div>
          <div className="project-content-padded">
            <span className="project-category">SAAS & PRODUCTIVITY</span>
            <h3 className="project-title-large">AI-Powered Student Productivity Dashboard (SaaS)</h3>
            <p className="project-desc-text">
              A comprehensive platform built to integrate an AI chatbot, Study Hub, notes management, task scheduling, habit tracking, and a focus timer. Features include mock interview preparation, code assistance, weather updates, news, file management, and intelligent search. Designed a responsive and interactive dashboard with personalized AI assistance to help students organize their studies, prepare for placements, manage daily tasks, and improve learning efficiency.
            </p>
            <div className="tech-stack-container" style={{ marginTop: '0' }}>
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">Vanilla CSS</span>
              <span className="tech-badge">Python</span>
              <span className="tech-badge">FastAPI</span>
              <span className="tech-badge">Groq SDK</span>
              <span className="tech-badge">Supabase</span>
              <span className="tech-badge">pypdf</span>
              <span className="tech-badge">python-docx</span>
              <span className="tech-badge">Feedparser</span>
            </div>
            
            <div className="project-action-row">
              <a href="https://github.com/varnit945/AI-POWERED-PERSONAL-DASHBOARD" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}><GithubIcon size={16} /> CODEBASE</a>
              <a href="https://ai-powered-personal-dashboard-fr3e.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'rgba(2, 4, 10, 0.6)' }}><ExternalLink size={16} /> LIVE DEMO</a>
            </div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="project-card-modern">
          <div className="project-banner">
            <img src="./ai_career_banner.png" alt="AI Career Analyzer Banner" />
          </div>
          <div className="project-content-padded">
            <span className="project-category" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>AI & ANALYTICS</span>
            <h3 className="project-title-large">AI Career Analyzer</h3>
            <p className="project-desc-text">
              An intelligent tool that evaluates users' skills, resumes, and career goals to provide personalized career recommendations. It helps identify skill gaps and generates customized learning roadmaps for career growth, guiding students and professionals toward their target roles.
            </p>
            <div className="tech-stack-container" style={{ marginTop: '0' }}>
              <span className="tech-badge">Vanilla JS/CSS</span>
              <span className="tech-badge">Python</span>
              <span className="tech-badge">Flask</span>
              <span className="tech-badge">Supabase</span>
              <span className="tech-badge">Docker</span>
              <span className="tech-badge">pypdf</span>
              <span className="tech-badge">pytesseract</span>
              <span className="tech-badge">ReportLab</span>
            </div>
            
            <div className="project-action-row">
              <a href="https://github.com/varnit945/AI_ANALYSER" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}><GithubIcon size={16} /> CODEBASE</a>
              <a href="https://ai-analyser-2sagy4aaq-varnit945s-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(2, 4, 10, 0.6)' }}><ExternalLink size={16} /> LIVE DEMO</a>
            </div>
          </div>
        </div>
      </motion.section>



      {/* CONTACT SECTION */}
      <motion.section 
        id="contact"
        ref={contactRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="glass-panel"
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#fff', fontWeight: '800' }}>
          Contact Me
        </h2>
        
        <div className="contact-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
              <Mail color="#ff003c" size={24} />
              <a href="mailto:varnitkamboj06@gmail.com" style={{ color: '#e2e8f0', textDecoration: 'none' }}>varnitkamboj06@gmail.com</a>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
              <Phone color="#ff003c" size={24} />
              <span style={{ color: '#e2e8f0' }}>9457072418</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="https://www.instagram.com/varnit__kamboz/" target="_blank" rel="noreferrer" className="social-link" style={{ background: '#cbd5e1', color: '#0f172a', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                <InstagramIcon size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" style={{ background: '#cbd5e1', color: '#0f172a', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                <LinkedinIcon size={24} />
              </a>
              <a href="https://github.com/varnit945" target="_blank" rel="noreferrer" className="social-link" style={{ background: '#cbd5e1', color: '#0f172a', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                <GithubIcon size={24} />
              </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a href="#" className="btn-primary" style={{ display: 'inline-flex', background: '#ff003c', color: 'white', padding: '0.875rem 2rem', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Download CV
              </a>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', margin: '0 0 1.5rem 0', fontWeight: '700' }}>Send Message</h3>
            <form action="https://api.web3forms.com/submit" method="POST" className="contact-form">
              <input type="hidden" name="access_key" value="f505eb36-c750-444e-83b2-56ded5bdf47f" />
              <input type="hidden" name="subject" value="New Submission from Portfolio" />
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" name="name" id="name" placeholder="John Doe" className="form-input" required />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" name="email" id="email" placeholder="john@example.com" className="form-input" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" name="message_subject" id="subject" placeholder="General Inquiry" className="form-input" required />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Your Message</label>
                <textarea name="message" id="message" rows="4" placeholder="Write your project details or inquiries here..." className="form-textarea" required></textarea>
              </div>

              <button type="submit" className="btn-submit">
                <Send size={18} /> SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
