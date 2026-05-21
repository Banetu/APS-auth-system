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
	university_name: string | null;
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

interface VerifiedJoinProfile {
	id: string;
	universityName: string;
	studentId: string;
	name: string;
	furigana: string;
	faculty: string;
	department: string;
	schoolYear: string;
	lineName: string;
	phoneNumber: string;
	email: string;
	status: string;
	createdAt: string;
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

interface EditForm {
	universityName: string;
	studentId: string;
	name: string;
	furigana: string;
	faculty: string;
	department: string;
	schoolYear: string;
	lineName: string;
	phoneNumber: string;
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

type ProfileSortKey = 'faculty' | 'studentId' | 'schoolYear' | 'name' | 'lineName';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const dashboardAllowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_EMAILS || '')
		.split(',')
		.map((v) => v.trim().toLowerCase())
		.filter(Boolean);
	const [summary, setSummary] = useState<DashboardSummary | null>(null);
	const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
	const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [verifyingId, setVerifyingId] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'join' | 'contact'; label: string } | null>(null);
	const [editingProfile, setEditingProfile] = useState<VerifiedJoinProfile | null>(null);
	const emptyEditForm: EditForm = { universityName: '', studentId: '', name: '', furigana: '', faculty: '', department: '', schoolYear: '', lineName: '', phoneNumber: '' };
	const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
	const [savingProfile, setSavingProfile] = useState(false);
	const [aoyamaOnly, setAoyamaOnly] = useState(false);
	const [profileSortKey, setProfileSortKey] = useState<ProfileSortKey>('faculty');
	const [profileSortDirection, setProfileSortDirection] = useState<SortDirection>('asc');

	const getMetadataValue = (metadata: Record<string, unknown> | null, key: string): string => {
		if (!metadata) {
			return '-';
		}
		const value = metadata[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value;
		}
		return '-';
	};

	const verifiedJoinProfiles: VerifiedJoinProfile[] = joinRequests
		.filter((req) => req.status === 'verified' || req.status === 'member')
		.map((req) => ({
			id: req.id,
			universityName: req.university_name?.trim() || '青山学院大学',
			studentId: getMetadataValue(req.metadata, 'student_id'),
			name: req.name || '-',
			furigana: getMetadataValue(req.metadata, 'furigana'),
			faculty: getMetadataValue(req.metadata, 'faculty'),
			department: getMetadataValue(req.metadata, 'department'),
			schoolYear: getMetadataValue(req.metadata, 'school_year'),
			lineName: getMetadataValue(req.metadata, 'line_name'),
			phoneNumber: getMetadataValue(req.metadata, 'phone_number'),
			email: req.email || '-',
			status: req.status,
			createdAt: req.created_at,
		}));

	const normalizeSortValue = (value: string): string => {
		if (value === '-') {
			return '';
		}
		return value.trim();
	};

	const parseSchoolYear = (value: string): number => {
		const normalized = normalizeSortValue(value);
		const match = normalized.match(/\d+/);
		if (!match) {
			return Number.MAX_SAFE_INTEGER;
		}
		return Number(match[0]);
	};

	const filteredAndSortedProfiles = [...verifiedJoinProfiles]
		.filter((profile) => !aoyamaOnly || profile.universityName === '青山学院大学')
		.sort((a, b) => {
			const direction = profileSortDirection === 'asc' ? 1 : -1;

			if (profileSortKey === 'schoolYear') {
				const aYear = parseSchoolYear(a.schoolYear);
				const bYear = parseSchoolYear(b.schoolYear);
				if (aYear !== bYear) {
					return (aYear - bYear) * direction;
				}
			}

			const aValue = normalizeSortValue(a[profileSortKey]);
			const bValue = normalizeSortValue(b[profileSortKey]);
			const compared = aValue.localeCompare(bValue, 'ja', { numeric: true, sensitivity: 'base' });
			if (compared !== 0) {
				return compared * direction;
			}

			return a.name.localeCompare(b.name, 'ja', { numeric: true, sensitivity: 'base' });
		});

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
		}
	}, [status, router]);

	useEffect(() => {
		if (status !== 'authenticated') {
			return;
		}

		const email = session?.user?.email?.trim().toLowerCase();
		if (!email) {
			router.push('/login');
			return;
		}

		if (dashboardAllowedEmails.length > 0 && !dashboardAllowedEmails.includes(email)) {
			router.push('/login?error=AccessDenied');
		}
	}, [status, session?.user?.email, router]);

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
			if (studentResponse.ok) {
				const studentData = await studentResponse.json().catch(() => ({ data: [] }));
				setStudentProfiles(studentData.data || studentData || []);
			}

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
		const email = session?.user?.email?.trim().toLowerCase();
		const canAccessDashboard =
			status === 'authenticated' &&
			Boolean(email) &&
			(dashboardAllowedEmails.length === 0 || dashboardAllowedEmails.includes(email as string));

		if (canAccessDashboard) {
			void fetchDashboardData();
		}
	}, [status, session?.user?.email]);

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

	const closeMessageModal = () => {
		setSelectedContact(null);
	};

	const handleVerify = async (id: string, label: string) => {
		if (!window.confirm(`「${label}」を認証済みにしてメールを送信しますか？`)) return;
		setVerifyingId(id);
		try {
			const res = await fetch(`/api/v1/dashboard/join-requests/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'verified' }),
			});
			if (!res.ok) throw new Error('認証済みへの変更に失敗しました');
			setJoinRequests((prev) =>
				prev.map((r) => r.id === id ? { ...r, status: 'verified' } : r)
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : '失敗しました');
		} finally {
			setVerifyingId(null);
		}
	};

	const handleEditProfile = (profile: VerifiedJoinProfile) => {
		const v = (s: string) => (s === '-' ? '' : s);
		setEditForm({
			universityName: v(profile.universityName),
			studentId: v(profile.studentId),
			name: v(profile.name),
			furigana: v(profile.furigana),
			faculty: v(profile.faculty),
			department: v(profile.department),
			schoolYear: v(profile.schoolYear),
			lineName: v(profile.lineName),
			phoneNumber: v(profile.phoneNumber),
		});
		setEditingProfile(profile);
	};

	const handleSaveProfile = async () => {
		if (!editingProfile) return;
		setSavingProfile(true);
		try {
			const res = await fetch(`/api/v1/dashboard/join-requests/${editingProfile.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					profile: {
						name: editForm.name,
						university_name: editForm.universityName,
						metadata: {
							student_id: editForm.studentId,
							furigana: editForm.furigana,
							faculty: editForm.faculty,
							department: editForm.department,
							school_year: editForm.schoolYear,
							line_name: editForm.lineName,
							phone_number: editForm.phoneNumber,
						},
					},
				}),
			});
			if (!res.ok) throw new Error('保存に失敗しました');
			setJoinRequests((prev) =>
				prev.map((r) => {
					if (r.id !== editingProfile.id) return r;
					return {
						...r,
						name: editForm.name,
						university_name: editForm.universityName,
						metadata: {
							...r.metadata,
							student_id: editForm.studentId,
							furigana: editForm.furigana,
							faculty: editForm.faculty,
							department: editForm.department,
							school_year: editForm.schoolYear,
							line_name: editForm.lineName,
							phone_number: editForm.phoneNumber,
						},
					};
				})
			);
			setEditingProfile(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : '保存に失敗しました');
		} finally {
			setSavingProfile(false);
		}
	};

	const handleDelete = async () => {
		if (!confirmDelete) return;
		const { id, type } = confirmDelete;
		setDeletingId(id);
		setConfirmDelete(null);
		try {
			const endpoint =
				type === 'join'
					? `/api/v1/dashboard/join-requests/${id}`
					: `/api/v1/dashboard/contacts/${id}`;
			const res = await fetch(endpoint, { method: 'DELETE' });
			if (!res.ok) throw new Error('削除に失敗しました');
			if (type === 'join') {
				setJoinRequests((prev) => prev.filter((r) => r.id !== id));
			} else {
				setContacts((prev) => prev.filter((c) => c.id !== id));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : '削除に失敗しました');
		} finally {
			setDeletingId(null);
		}
	};

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
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学生番号</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">フリガナ</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学部</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学科</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学年</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LINE 名</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">電話番号</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メールアドレス</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{joinRequests.length === 0 ? (
									<tr>
										<td colSpan={12} className="px-6 py-4 text-center text-gray-500">
											データがありません
										</td>
									</tr>
								) : (
									joinRequests.map((req) => (
										<tr key={req.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getMetadataValue(req.metadata, 'student_id')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'furigana')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'faculty')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'department')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'school_year')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'line_name')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getMetadataValue(req.metadata, 'phone_number')}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.email}</td>
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
											<td className="px-4 py-4 whitespace-nowrap text-right">
												<div className="flex flex-col gap-1 items-end">
													{req.status !== 'verified' && (
														<button
															type="button"
															disabled={verifyingId === req.id}
															onClick={() => handleVerify(req.id, `${req.name}（${req.email}）`)}
															className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline disabled:opacity-40"
														>
															{verifyingId === req.id ? '処理中…' : '認証済みにする'}
														</button>
													)}
													<button
														type="button"
														disabled={deletingId === req.id}
														onClick={() => setConfirmDelete({ id: req.id, type: 'join', label: `${req.name}（${req.email}）` })}
														className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-40"
													>
														{deletingId === req.id ? '削除中…' : '削除'}
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* 学生プロフィール テーブル */}
				<div className="mt-10 bg-white shadow rounded-xl overflow-hidden">
					<div className="px-7 py-5 border-b border-gray-200 space-y-4">
						<h2 className="text-xl font-bold text-gray-900">学生プロフィール一覧（認証成功者）</h2>
						<div className="flex flex-wrap items-center gap-4">
							<label className="inline-flex items-center gap-2 text-sm text-gray-700">
								<input
									type="checkbox"
									checked={aoyamaOnly}
									onChange={(e) => setAoyamaOnly(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								青山学院大学生のみ表示
							</label>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-gray-600">ソート</span>
								<select
									value={profileSortKey}
									onChange={(e) => setProfileSortKey(e.target.value as ProfileSortKey)}
									className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700"
								>
									<option value="faculty">学部順</option>
									<option value="studentId">学生番号順</option>
									<option value="schoolYear">学年順</option>
									<option value="name">氏名順</option>
									<option value="lineName">LINE名順</option>
								</select>
								<button
									type="button"
									onClick={() => setProfileSortDirection('asc')}
									className={`rounded px-2.5 py-1 text-xs font-semibold ${
										profileSortDirection === 'asc'
											? 'bg-blue-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									昇順
								</button>
								<button
									type="button"
									onClick={() => setProfileSortDirection('desc')}
									className={`rounded px-2.5 py-1 text-xs font-semibold ${
										profileSortDirection === 'desc'
											? 'bg-blue-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									降順
								</button>
							</div>
							<span className="text-xs text-gray-500">
								表示件数: {filteredAndSortedProfiles.length} / {verifiedJoinProfiles.length}
							</span>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">大学名</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">学生番号</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">氏名</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">フリガナ</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">学部</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">学科</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">学年</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">LINE 名</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">電話番号</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">メールアドレス</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ステータス</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">作成日</th>
									<th className="px-7 py-4" />
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredAndSortedProfiles.length === 0 ? (
									<tr>
										<td colSpan={12} className="px-7 py-6 text-center text-gray-500">
											データがありません
										</td>
									</tr>
								) : (
									filteredAndSortedProfiles.map((profile) => (
										<tr key={profile.id} className="hover:bg-gray-50">
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-900">{profile.universityName}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-900">{profile.studentId}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-900">{profile.name}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.furigana}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.faculty}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.department}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.schoolYear}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.lineName}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.phoneNumber}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{profile.email}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														profile.status === 'verified'
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}`}
												>
												{profile.status}
												</span>
											</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-500">
												{new Date(profile.createdAt).toLocaleString('ja-JP')}
											</td>
											<td className="px-4 py-5 whitespace-nowrap text-right">
												<div className="flex flex-col gap-1 items-end">
													<button
														type="button"
														onClick={() => handleEditProfile(profile)}
														className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
													>
														編集
													</button>
													<button
														type="button"
														disabled={deletingId === profile.id}
														onClick={() => setConfirmDelete({ id: profile.id, type: 'join', label: `${profile.name}（${profile.email}）` })}
														className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-40"
													>
														{deletingId === profile.id ? '削除中…' : '削除'}
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* お問い合わせ テーブル */}
				<div className="mt-10 mb-10 bg-white shadow rounded-xl overflow-hidden">
					<div className="px-7 py-5 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900">お問い合わせ一覧</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">氏名</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">メール</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">件名</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">所属</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">メッセージ</th>
									<th className="px-7 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">受信日</th>
									<th className="px-7 py-4" />
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{contacts.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-7 py-6 text-center text-gray-500">
											お問い合わせがありません
										</td>
									</tr>
								) : (
									contacts.map((contact) => (
										<tr key={contact.id} className="hover:bg-gray-50">
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{contact.email}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{contact.subject || '-'}</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-600">{contact.affiliation || '-'}</td>
											<td className="px-7 py-5 max-w-xs text-sm text-gray-600 leading-relaxed">
												{contact.message ? (
													<button
														type="button"
														onClick={() => setSelectedContact(contact)}
														className="block max-w-xs truncate text-left text-blue-700 hover:text-blue-900 hover:underline"
														title="クリックして全文を表示"
													>
														{contact.message}
													</button>
												) : (
													'-'
												)}
											</td>
											<td className="px-7 py-5 whitespace-nowrap text-sm text-gray-500">
												{new Date(contact.created_at).toLocaleDateString('ja-JP')}
											</td>
											<td className="px-4 py-5 whitespace-nowrap text-right">
											<button
												type="button"
												disabled={deletingId === contact.id}
												onClick={() => setConfirmDelete({ id: contact.id, type: 'contact', label: `${contact.name}（${contact.email}）` })}
												className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-40"
											>
												{deletingId === contact.id ? '削除中…' : '削除'}
											</button>
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

				{editingProfile && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
						<div className="w-full max-w-lg rounded-xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
							<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
								<h3 className="text-base font-bold text-gray-900">プロフィール編集</h3>
								<button type="button" onClick={() => setEditingProfile(null)} className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100">閉じる</button>
							</div>
							<div className="px-6 py-5">
								<p className="mb-4 text-xs text-gray-400">メールアドレス: <span className="font-medium text-gray-600">{editingProfile.email}</span></p>
								<div className="grid grid-cols-2 gap-4">
									{([
										['大学名', 'universityName'],
										['学生番号', 'studentId'],
										['氏名', 'name'],
										['フリガナ', 'furigana'],
										['学部', 'faculty'],
										['学科', 'department'],
										['学年', 'schoolYear'],
										['LINE名', 'lineName'],
										['電話番号', 'phoneNumber'],
									] as [string, keyof EditForm][]).map(([label, key]) => (
										<div key={key}>
											<label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
											<input
												type="text"
												value={editForm[key]}
												onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
												className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
											/>
										</div>
									))}
								</div>
							</div>
							<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
								<button type="button" onClick={() => setEditingProfile(null)} className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">キャンセル</button>
								<button
									type="button"
									disabled={savingProfile}
									onClick={handleSaveProfile}
									className="rounded px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
								>
									{savingProfile ? '保存中…' : '保存する'}
								</button>
							</div>
						</div>
					</div>
				)}

				{confirmDelete && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
						<div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
							<div className="px-6 py-5">
								<h3 className="text-base font-bold text-gray-900 mb-2">削除の確認</h3>
								<p className="text-sm text-gray-600">
									以下のデータを削除しますか？この操作は取り消せません。
								</p>
								<p className="mt-2 text-sm font-medium text-gray-800 break-all">{confirmDelete.label}</p>
							</div>
							<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
								<button
									type="button"
									onClick={() => setConfirmDelete(null)}
									className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
								>
									キャンセル
								</button>
								<button
									type="button"
									onClick={handleDelete}
									className="rounded px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
								>
									削除する
								</button>
							</div>
						</div>
					</div>
				)}

				{selectedContact && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeMessageModal}>
						<div
							className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
								<h3 className="text-lg font-bold text-gray-900">お問い合わせメッセージ全文</h3>
								<button
									type="button"
									onClick={closeMessageModal}
									className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								>
									閉じる
								</button>
							</div>
							<div className="space-y-3 px-6 py-5 text-sm text-gray-700">
								<p><span className="font-semibold text-gray-900">氏名:</span> {selectedContact.name}</p>
								<p><span className="font-semibold text-gray-900">メール:</span> {selectedContact.email}</p>
								<p><span className="font-semibold text-gray-900">件名:</span> {selectedContact.subject || '-'}</p>
								<div>
									<p className="font-semibold text-gray-900">メッセージ:</p>
									<p className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-3 leading-relaxed">
										{selectedContact.message || '-'}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
