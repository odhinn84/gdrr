import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="w-full flex justify-center">
            <div className="container">
                <div className="text-4xl m-8">
                    <b>GDRR</b>
                </div>
                <div>
                    <ul className="menu bg-base-200 rounded-box w-56">
                        <li>
                            <Link href="/articleFilter/1">
                                게임 기사 선택
                            </Link>
                            {/* <Link href="/search">
                                검색
                            </Link>
                            <Link href="/search2">
                                검색 2
                            </Link>
                            <Link href="/search3">
                                검색 3
                            </Link> */}
                            {/* <Link href="/search4">
                                검색 4
                            </Link> */}
                            <Link href="/search5">
                                검색 5
                            </Link>
                            {/* <a href="/articleFilter/1">게임 기사 선택</a> */}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
