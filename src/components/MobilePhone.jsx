const MobilePhone = () => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[6px] 
      rounded-[1.2rem] 
      h-[315px] w-[158px] 
      md:h-[385px] md:w-[193px] md:border-[8px] md:rounded-[1.6rem]
      lg:h-[450px] lg:w-[225px] lg:border-[10px] lg:rounded-[1.8rem]">

    <div className="absolute bg-gray-800 dark:bg-gray-800 rounded-s-lg 
        h-[18px] w-[2px] -start-[9px] top-[40px]
        md:h-[26px] md:-start-[10px] md:top-[50px]
        lg:h-[24px] lg:-start-[12px] lg:top-[54px]"></div>

    <div className="absolute bg-gray-800 dark:bg-gray-800 rounded-s-lg 
        h-[26px] w-[2px] -start-[9px] top-[68px]
        md:h-[32px] md:-start-[10px] md:top-[88px]
        lg:h-[34px] lg:-start-[12px] lg:top-[93px]"></div>

    <div className="absolute bg-gray-800 dark:bg-gray-800 rounded-s-lg 
        h-[26px] w-[2px] -start-[9px] top-[100px]
        md:h-[32px] md:-start-[10px] md:top-[128px]
        lg:h-[34px] lg:-start-[12px] lg:top-[134px]"></div>

    <div className="absolute bg-gray-800 dark:bg-gray-800 rounded-e-lg 
        h-[36px] w-[2px] -end-[9px] top-[80px]
        md:h-[44px] md:-end-[10px] md:top-[100px]
        lg:h-[48px] lg:-end-[12px] lg:top-[107px]"></div>

    <div className="rounded-[1rem] overflow-hidden 
        w-[142px] h-[303px] 
        md:w-[180px] md:h-[360px] md:rounded-[1.3rem]
        lg:w-[205px] lg:h-[430px] lg:rounded-[1.5rem] 
        bg-white dark:bg-gray-800">
      
      <img src="./preview_mobile.png" 
          className="dark:hidden w-full h-full" alt="" />
      <img src="./preview_mobile.png" 
          className="hidden dark:block w-full h-full" alt="" />
    </div>
  </div>
  )
}

export default MobilePhone;