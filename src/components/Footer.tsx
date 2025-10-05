import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <div className="flex flex-col gap-10 p-8 border border-t-primary w-full bg-[#F6F4EB]">
      <div className="justify-center flex gap-[112px]">
        <div>
          <Image
            className="mt-[-32px]"
            src={'/logo.svg'}
            alt={'footer_logo'}
            width={200}
            height={100}
          ></Image>
          <p className="text-gray-400">
            당신의 일상에 숲이 되어 줄 수 있는
            <br /> 문구 큐레이션 플랫폼
          </p>
        </div>
        <div>
          <h2 className="font-bold pb-2 text-[18px]">고객센터</h2>
          <div className="flex gap-22">
            <ul className="flex flex-col gap-2.5 text-gray-400">
              <li>
                <Link href='/help/faq'>
                 <button className='cursor-pointer hover:underline'>자주 묻는 질문(FAQ)</button>
                </Link>
               
              </li>
              <li>
                <Link href='/help/notice'>
                 <button className='cursor-pointer hover:underline'>공지사항</button>
                </Link>
              </li>
              <li>
                <Link href='/help/contact'>
                 <button className='cursor-pointer hover:underline'>문의하기</button>
                </Link>
              </li>
            </ul>
            <ul className="flex flex-col gap-2.5 text-gray-400">
              <li>
                <Link href="/terms">
                  이용약관
                </Link>
              </li>
              <li>
                <button>개인정보처리방침</button>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-2 text-[18px]">Contact</h2>
          <ul className="text-gray-400 flex flex-col gap-2.5">
            <li>(주)모리모리</li>
            <li>서울특별시 강남구 테헤란로 123 7층 모리모리</li>
            <li>대표 : 이소민</li>
            <li>사업자등록번호 : 684-67-00285</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-gray-400">
        ⓒ 2025 morimori. All Rights Reserved.{' '}
      </p>
    </div>
  );
}
export default Footer;
