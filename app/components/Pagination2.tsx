const Pagination2 = (props: any) => {
    const items = props.items;
    const pageSize = props.pageSize
    const currentPage = props.currentPage
    const onPageChange = props.onPageChange
    const onPageChange2 = props.onPageChange2

    const pagesCount = Math.ceil(items / pageSize); // 100/10

    if (pagesCount === 1) return null;
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

    return (
        <div>
            {/* <ul className="flex justify-between items-center list-none max-md:hidden">
                {pages.map((page) => (
                    <li
                        key={page}
                    >
                        <a 
                        className={
                            page === currentPage ? "flex justify-center items-center w-8 h-8 border rounded-lg bg-red-400" : "flex justify-center items-center w-8 h-8 border rounded-lg bg-red-50"
                        } 
                        onClick={() => onPageChange(page)}
                        >
    
                            {page}
                        </a>
                    </li>
                ))}
            </ul> */}

            <div className="flex justify-between items-center list-none ">
                {
                    currentPage === 1 ? <button className=" text-gray-400 max-md:hidden" >หน้าแรกสุด</button> : <button onClick={() => onPageChange2(1)} className=" max-md:hidden">หน้าแรกสุด</button>
                }
                {
                    currentPage === 1 ? <button className=" text-gray-400" >ก่อนหน้า</button> : <button onClick={() => onPageChange2(currentPage - 1)} >ก่อนหน้า</button>
                }

                <p>หน้า {currentPage} จาก {pagesCount} หน้า</p>

                {
                    currentPage === pagesCount || pagesCount === 0 ? <button className=" text-gray-400" >ถัดไป </button> :  <button onClick={() => onPageChange2(currentPage + 1)}>ถัดไป</button>
                }
                {
                    currentPage === pagesCount || pagesCount === 0 ? <button className=" text-gray-400  max-md:hidden" >หน้าท้ายสุด</button> : <button onClick={() => onPageChange2(pagesCount)} className=" max-md:hidden">หน้าท้ายสุด</button>
                }

            </div>


        </div>
    );
};

export default Pagination2;