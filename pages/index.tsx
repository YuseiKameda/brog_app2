import type { NextPage } from 'next';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Welcome to Brog App</h2>
      <p className="text-gray-700">
        ここにアプリの紹介文や概要を記載します。
      </p>
    </Layout>
  );
};

export default Home;
