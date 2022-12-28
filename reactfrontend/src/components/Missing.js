import { Link } from 'react-router-dom';

const Missing = () => {
    return (
        <main className='Missing'>

            <h2>ページが見つかりません</h2>
            <p>
                <Link to='/'>ホームへ戻る</Link>
            </p>
        </main>
    )
}

export default Missing