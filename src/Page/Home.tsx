import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'

export default function Home() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      navigate(`/dashboard/${username}`)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-base-100 rounded-xl shadow-md overflow-hidden p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Analyze Your GitHub Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                id="username"
                className="input input-bordered w-full"
                placeholder="e.g. octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full">
              Analyze Profile
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p>This tool will analyze your public GitHub repositories and activity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}