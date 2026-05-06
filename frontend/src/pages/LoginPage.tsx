import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { mockUsers } from '@/mocks/data/users'
import { ChevronRight } from 'lucide-react'
import { User } from '@/types'

const DEMO_USERS = [
  {
    label: '运营总部',
    desc: '负责标讯采集、上传和全局管理',
    email: 'zhang@company.com',
    icon: '运',
    iconBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    label: '销管',
    desc: '负责手工分配和追踪标讯',
    email: 'zhao.sa@company.com',
    icon: '销',
    iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    label: '客户经理(AR)',
    desc: '负责商机上报和反馈',
    email: 'wu.ar@company.com',
    icon: '客',
    iconBg: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    label: '大区Leader',
    desc: '查看本大区标讯全貌',
    email: 'sun.rl@company.com',
    icon: '区',
    iconBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
]

export default function LoginPage() {
  const setUser = useAuthStore(s => s.setUser)
  const navigate = useNavigate()

  const doLogin = (u: User) => {
    setUser(u, `mock-token-${u.id}`)
    navigate('/dashboard')
  }

  return (
    <>
      <style>{`
        @keyframes beam-pulse {
          0%, 100% { opacity: 0.12; transform: translateY(0px) rotate(var(--r)); }
          50% { opacity: 0.22; transform: translateY(-20px) rotate(var(--r)); }
        }
        @keyframes beam-shimmer {
          0% { opacity: 0.08; transform: translateX(-30px) rotate(var(--r)); }
          50% { opacity: 0.2; transform: translateX(20px) rotate(var(--r)); }
          100% { opacity: 0.08; transform: translateX(-30px) rotate(var(--r)); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes card-hover-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          50% { box-shadow: 0 0 20px 2px rgba(59,130,246,0.15); }
        }
        .login-role-card {
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .login-role-card:hover {
          background: rgba(59,130,246,0.12) !important;
          border-color: rgba(96,165,250,0.6) !important;
          transform: translateX(4px);
        }
        .login-role-card:hover .role-arrow {
          opacity: 1;
          color: #60a5fa;
        }
        .role-arrow {
          opacity: 0.4;
          transition: opacity 0.2s, color 0.2s;
        }
      `}</style>

      {/* Full-screen dark container */}
      <div
        className="relative min-h-screen w-full overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(135deg, #020818 0%, #050d2e 40%, #0a1628 100%)' }}
      >

        {/* ── Light beam layer ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Beam 1 – large diagonal blue */}
          <div style={{
            position: 'absolute', top: '-10%', left: '15%',
            width: '3px', height: '130%',
            background: 'linear-gradient(180deg, transparent, #3b82f6, #60a5fa, transparent)',
            '--r': '25deg', transform: 'rotate(25deg)',
            animation: 'beam-pulse 6s ease-in-out infinite',
            opacity: 0.18,
          } as React.CSSProperties} />
          {/* Beam 2 – purple streak */}
          <div style={{
            position: 'absolute', top: '-5%', left: '35%',
            width: '2px', height: '110%',
            background: 'linear-gradient(180deg, transparent, #818cf8, #a78bfa, transparent)',
            '--r': '20deg', transform: 'rotate(20deg)',
            animation: 'beam-pulse 8s ease-in-out infinite 1.5s',
            opacity: 0.14,
          } as React.CSSProperties} />
          {/* Beam 3 – wide soft glow left */}
          <div style={{
            position: 'absolute', top: '0%', left: '-5%',
            width: '400px', height: '100%',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15), transparent 70%)',
            '--r': '0deg',
            animation: 'beam-shimmer 10s ease-in-out infinite',
          } as React.CSSProperties} />
          {/* Beam 4 – right side glow */}
          <div style={{
            position: 'absolute', top: '20%', right: '-5%',
            width: '350px', height: '80%',
            background: 'radial-gradient(ellipse at 80% 40%, rgba(99,102,241,0.12), transparent 70%)',
            '--r': '0deg',
            animation: 'beam-shimmer 12s ease-in-out infinite 3s',
          } as React.CSSProperties} />
          {/* Beam 5 – thin fast streak */}
          <div style={{
            position: 'absolute', top: '-20%', left: '60%',
            width: '1px', height: '140%',
            background: 'linear-gradient(180deg, transparent, #93c5fd, transparent)',
            '--r': '15deg', transform: 'rotate(15deg)',
            animation: 'beam-shimmer 7s ease-in-out infinite 0.8s',
            opacity: 0.25,
          } as React.CSSProperties} />
          {/* Beam 6 – bottom ambient */}
          <div style={{
            position: 'absolute', bottom: '-10%', left: '30%',
            width: '600px', height: '300px',
            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08), transparent 70%)',
            '--r': '0deg',
            animation: 'beam-pulse 9s ease-in-out infinite 2s',
          } as React.CSSProperties} />
        </div>

        {/* ── Top navigation bar ── */}
        <nav
          className="relative z-10 flex items-center justify-between px-8 py-4 w-full"
          style={{ borderBottom: '1px solid rgba(99,179,237,0.1)' }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              标
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">智能标讯分发系统</div>
              <div className="text-xs leading-tight" style={{ color: '#64748b' }}>Smart Bid Dispatch</div>
            </div>
          </div>

          {/* Nav links + version */}
          <div className="flex items-center gap-6">
            {['PC端权限申请', 'APP端权限申请', '账号解冻申请'].map(link => (
              <button
                key={link}
                className="text-xs cursor-pointer transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
              >
                {link}
              </button>
            ))}
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white' }}
            >
              V 1.0.0
            </span>
          </div>
        </nav>

        {/* ── Main content ── */}
        <div className="relative z-10 flex flex-1 items-center">

          {/* Left brand area ~55% */}
          <div
            className="flex flex-col items-start justify-center px-16"
            style={{ width: '55%', animation: 'float-slow 6s ease-in-out infinite' }}
          >
            {/* Subtitle with decorative lines */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6)' }} />
              <span className="text-sm font-medium tracking-widest" style={{ color: '#60a5fa' }}>
                让标讯流转更智能
              </span>
              <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #3b82f6, transparent)' }} />
            </div>

            {/* Main title */}
            <h1
              className="font-bold leading-tight mb-6"
              style={{
                fontSize: '3.5rem',
                color: 'white',
                textShadow: '0 0 40px rgba(59,130,246,0.4)',
                letterSpacing: '0.05em',
              }}
            >
              智能标讯
              <br />
              分发系统
            </h1>

            {/* Tag line */}
            <div className="flex items-center gap-4">
              {['全链路', '智能分级', '数据闭环'].map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span style={{ color: '#3b82f6' }}>·</span>
                  <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>{tag}</span>
                </span>
              ))}
            </div>

            {/* Decorative grid dots */}
            <div className="mt-12 grid grid-cols-8 gap-3" style={{ opacity: 0.15 }}>
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ background: '#3b82f6', opacity: Math.random() * 0.8 + 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Right login card ~40% */}
          <div className="flex items-center justify-center" style={{ width: '45%' }}>
            <div
              className="relative w-full max-w-sm rounded-2xl p-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99,179,237,0.25)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Corner bracket — top-left */}
              <div className="absolute top-0 left-0" style={{ width: 20, height: 20 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: 20, height: 20,
                  borderTop: '2px solid #3b82f6',
                  borderLeft: '2px solid #3b82f6',
                  borderRadius: '2px 0 0 0',
                }} />
              </div>
              {/* Corner bracket — top-right */}
              <div className="absolute top-0 right-0" style={{ width: 20, height: 20 }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 20, height: 20,
                  borderTop: '2px solid #3b82f6',
                  borderRight: '2px solid #3b82f6',
                  borderRadius: '0 2px 0 0',
                }} />
              </div>
              {/* Corner bracket — bottom-left */}
              <div className="absolute bottom-0 left-0" style={{ width: 20, height: 20 }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: 20, height: 20,
                  borderBottom: '2px solid #3b82f6',
                  borderLeft: '2px solid #3b82f6',
                  borderRadius: '0 0 0 2px',
                }} />
              </div>
              {/* Corner bracket — bottom-right */}
              <div className="absolute bottom-0 right-0" style={{ width: 20, height: 20 }}>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 20, height: 20,
                  borderBottom: '2px solid #3b82f6',
                  borderRight: '2px solid #3b82f6',
                  borderRadius: '0 0 2px 0',
                }} />
              </div>

              {/* Card title */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">登录</h2>
                <p className="text-xs" style={{ color: '#64748b' }}>选择角色进入系统 · Demo 模式</p>
              </div>

              {/* Role cards */}
              <div className="flex flex-col gap-3">
                {DEMO_USERS.map(d => (
                  <button
                    key={d.email}
                    className="login-role-card w-full flex items-center gap-4 rounded-xl px-4 py-3 text-left cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(99,179,237,0.15)',
                    }}
                    onClick={() => {
                      const u = mockUsers.find(u => u.email === d.email)
                      if (u) doLogin(u)
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: d.iconBg }}
                    >
                      {d.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{d.label}</div>
                      <div className="text-xs truncate mt-0.5" style={{ color: '#64748b' }}>{d.desc}</div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={16} className="role-arrow flex-shrink-0" style={{ color: '#94a3b8' }} />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(99,179,237,0.1)' }}>
                <p className="text-center text-xs" style={{ color: '#334155' }}>
                  © 2024 ISG · 智能标讯分发系统
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
