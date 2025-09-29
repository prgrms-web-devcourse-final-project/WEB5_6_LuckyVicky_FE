import Button from '@/components/Button';

function Page() {
  return (
    <div className="relative z-10 pt-16 rounded-2xl border border-[var(--color-primary)] bg-white p-6 shadow-[8px_8px_0_0_var(--color-primary-40)]">
      <h1 className="mb-6 text-center text-[32px] font-bold">비밀번호 찾기</h1>
      <h2 className="mb-15 text-center text-xl">
        가입한 이메일(아이디)을 입력해 주세요.
      </h2>
      <div className="max-w-[463px] flex flex-col items-center justify-center mx-auto mb-[130px] gap-[30px]">
        <input
          type="email"
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="이메일(아이디)"
          required
        />
        <Button className="w-full mx-auto">비밀번호 찾기</Button>
      </div>
    </div>
  );
}
export default Page;
