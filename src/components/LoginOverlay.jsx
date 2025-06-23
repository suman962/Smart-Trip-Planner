const LoginOverlayClouds = () => {
  return (
    <div>
      <svg className="absolute top-[15%] left-[10%] w-24 h-auto text-white" fill="currentColor" viewBox="0 0 64 64">
        <path d="M48 32c0-6.6-5.4-12-12-12-2.5 0-4.9.8-6.9 2.1C26.5 19.5 22 16 16.5 16 9.6 16 4 21.6 4 28.5S9.6 41 16.5 41H46c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/>
      </svg>

      <svg className="absolute bottom-[6%] right-8 w-32 h-auto text-white opacity-80 scale-x-[-1]" fill="currentColor" viewBox="0 0 64 64">
        <path d="M48 32c0-6.6-5.4-12-12-12-2.5 0-4.9.8-6.9 2.1C26.5 19.5 22 16 16.5 16 9.6 16 4 21.6 4 28.5S9.6 41 16.5 41H46c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/>
      </svg>

      <svg className="absolute left-[9%] bottom-20 w-16 h-auto text-white opacity-70" fill="currentColor" viewBox="0 0 64 64">
        <path d="M48 32c0-6.6-5.4-12-12-12-2.5 0-4.9.8-6.9 2.1C26.5 19.5 22 16 16.5 16 9.6 16 4 21.6 4 28.5S9.6 41 16.5 41H46c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/>
      </svg>

    </div>
  );
}

const LoginOverlayAirplane = () => {
  return (
    <img
      src="./assets/airplane.png"
      className="absolute -top-25 -right-10 h-40 scale-x-[-1]"
    />
  );
}

export {
  LoginOverlayClouds,
  LoginOverlayAirplane
}