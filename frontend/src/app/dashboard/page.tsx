'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface JoinRequest {
	id: string;
	email: string;
	name: string;
	form_type: string;
	status: string;
	metadata: Record<string, unknown> | null;
	created_at: string;
	updated_at: string;
}

interface StudentProfile {
	id: string;
	student_number: string;
	name: string;
	email_aoyama: string;
	department: string;
	email_verified: boolean;
	created_at: string;
}

interface Contact {
	id: string;
	email: string;
	name: string;
	subject: string | null;
	affiliation: string | null;
	message: string | null;
	created_at: string;
}

interface DashboardSummary {
	join_requests: {
		total: number;
		verified: number;
	};
	student_profiles: {
		total: number;
		email_verified: number;
	};
	contacts: {
		total: number;
	};
}

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [summary, setSummary] = useState<DashboardSummary | null>(null);
	const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
	const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
		}
	}, [status, router]);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const getBaseUrl = (): string => {
				if (typeof window !== 'undefined') {
					return window.location.origin;
				}
				return '';
			};
			
			const baseUrl = getBaseUrl();

			// Summary データを取得
			const summaryResponse = await fetch(`${baseUrl}/api/v1/dashboard/summary`);
			if (!summaryResponse.ok) {
				const text = await summaryResponse.text();
				throw new Error(`Failed to fetch summary: ${summaryResponse.status} ${text}`);
			}
			const summaryData = await summaryResponse.json().catch(() => {
				throw new Error('Invalid JSON response for summary');
			});
			// Handle both old format (direct object) and new format (with status)
			setSummary(summaryData.contacts ? summaryData : { join_requests: { total: 0, verified: 0 }, student_profiles: { total: 0, email_verified: 0 }, contacts: { total: 0 } });

			// Join Requests を取得
			const joinResponse = await fetch(`${baseUrl}/api/v1/dashboard/join-requests`);
			if (!joinResponse.ok) {
				const text = await joinResponse.text();
				throw new Error(`Failed to fetch join requests: ${joinResponse.status} ${text}`);
			}
			const joinData = await joinResponse.json().catch(() => {
				throw new Error('Invalid JSON response for join requests');
			});
			setJoinRequests(joinData.data || joinData || []);

			// Student Profiles を取得
			const studentResponse = await fetch(`${baseUrl}/api/v1/dashboard/student-profiles`);
			if (!studentResponse.ok) {
				const text = await studentResponse.text();
				throw new Error(`Failed to fetch student profiles: ${studentResponse.status} ${text}`);
			}
			const studentData = await studentResponse.json().catch(() => {
				throw new Error('Invalid JSON response for student profiles');
			});
			setStudentProfiles(studentData.data || studentData || []);

			// Contacts を取得
			const contactResponse = await fetch(`${baseUrl}/api/v1/dashboard/contacts`);
			if (!contactResponse.ok) {
				const text = await contactResponse.text();
				throw new Error(`Failed to fetch contacts: ${contactResponse.status} ${text}`);
			}
			const contactData = await contactResponse.json().catch(() => {
				throw new Error('Invalid JSON response for contacts');
			});
			setContacts(contactData.data || contactData || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (status === 'authenticated') {
			void fetchDashboardData();
		}
	}, [status]);

	if (status === 'loading' || loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-8 px-4">
				{/* ヘッダー */}
				<div className="bg-white shadow rounded-lg p-6 mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
					<p className="text-gray-600">ログイン中: {session?.user?.email}</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
						<p className="text-red-800">{error}</p>
					</div>
				)}

				{/* 概要統計 */}
				{summary && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div className="bg-white rounded-lg shadow p-6">
							<div className="text-gray-600 text-sm font-medium">入会リクエスト</div>
							<div className="text-3xl font-bold text-gray-900 mt-2">{summary.join_requests.total}</div>
							<div className="text-gray-500 text-xs mt-2">総数</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="text-gray-600 text-sm font-medium">確認済み入会</div>
							<div className="text-3xl font-bold text-green-600 mt-2">{summary.join_requests.verified}</div>
							<div className="text-gray-500 text-xs mt-2">検証完了</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="text-gray-600 text-sm font-medium">学生プロフィール</div>
							<div className="text-3xl font-bold text-gray-900 mt-2">{summary.student_profiles.total}</div>
							<div className="text-gray-500 text-xs mt-2">総数</div>
						</div>

						<div className="bg-white rounded-lg shadow p-6">
							<div className="text-gray-600 text-sm font-medium">お問い合わせ</div>
							<div className="text-3xl font-bold text-blue-600 mt-2">{summary.contacts.total}</div>
							<div className="text-gray-500 text-xs mt-2">受信</div>
						</div>
					</div>
				)}

				{/* 入会リクエスト テーブル */}
				<div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900">入会リクエスト一覧</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メール</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">フォーム種別</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{joinRequests.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-6 py-4 text-center text-gray-500">
											データがありません
										</td>
									</tr>
								) : (
									joinRequests.map((req) => (
										<tr key={req.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.email}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.form_type}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														req.status === 'verified'
															? 'bg-green-100 text-green-800'
															: 'bg-yellow-100 text-yellow-800'
													}`}
												>
													{req.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(req.created_at).toLocaleDateString('ja-JP')}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* 学生プロフィール テーブル */}
				<div className="bg-white shadow rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900">学生プロフィール一覧</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学籍番号</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">専攻</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aoyama メール</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メール確認</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日時</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{studentProfiles.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
											データがありません
										</td>
									</tr>
								) : (
									studentProfiles.map((profile) => (
										<tr key={profile.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.student_number}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.department}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{profile.email_aoyama}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														profile.email_verified
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}`}
												>
												{profile.email_verified ? '✓' : '未確認'}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(profile.created_at).toLocaleString('ja-JP')}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* お問い合わせ テーブル */}
				<div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900">お問い合わせ一覧</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メール</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">件名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メッセージ</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受信日</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{contacts.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
											お問い合わせがありません
										</td>
									</tr>
								) : (
									contacts.map((contact) => (
										<tr key={contact.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contact.email}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contact.subject || '-'}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contact.affiliation || '-'}</td>
											<td className="px-6 py-4 max-w-xs truncate text-sm text-gray-600">{contact.message || '-'}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(contact.created_at).toLocaleDateString('ja-JP')}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* ナビゲーション */}
				<div className="mt-8 flex gap-4">
					<Link
						href="/"
						className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
					>
						ホームに戻る
					</Link>
				</div>
			</div>
		</div>
	);
}
