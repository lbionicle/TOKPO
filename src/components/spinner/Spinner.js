const Spinner = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={{margin: '0 auto', background: 'none', display: 'block'}} width="128px" height="128px" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid">
        <g>
            <circle cx="16" cy="64" r="16" fill="#224ef5" />
            <circle cx="16" cy="64" r="16" fill="#6c89f8" transform="rotate(45,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#a2b5fb" transform="rotate(90,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#d3dcfd" transform="rotate(135,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#e5eafe" transform="rotate(180,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#e5eafe" transform="rotate(225,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#e5eafe" transform="rotate(270,64,64)"
            />
            <circle cx="16" cy="64" r="16" fill="#e5eafe" transform="rotate(315,64,64)"
            />
            <animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64"
            calcMode="discrete" dur="720ms" repeatCount="indefinite">
            </animateTransform>
        </g>
        </svg> 
    )
}

export default Spinner;