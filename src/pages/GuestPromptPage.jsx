// src/pages/GuestPromptPage.jsx
// Halaman yang ditampilkan ketika user mencoba mengakses halaman yang butuh login
import LoginRegisterPrompt from "../components/LoginRegisterPrompt";

export default function GuestPromptPage({ onLogin, onRegister, onGoogle, onSkip }) {
  return (
    <LoginRegisterPrompt
      onLogin={onLogin}
      onRegister={onRegister}
      onGoogle={onGoogle}
      onSkip={onSkip}
    />
  );
}
