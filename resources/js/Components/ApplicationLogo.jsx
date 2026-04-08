export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="url(#paint0_linear_logo)" />
            <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24V22H24V26H32C31.4477 28.2761 29.4249 30 24 30C20.6863 30 18 27.3137 18 24C18 20.6863 20.6863 18 24 18C26.1513 18 28.0573 19.1352 29.1364 20.8351L32.4842 18.5901C30.7042 15.7891 27.5746 14 24 14V12Z" fill="white" />
            <defs>
                <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
            </defs>
        </svg>
    );
}
