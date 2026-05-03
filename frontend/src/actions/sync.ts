// 役割: 同期実行Action
"use server";

// NOTE: roles API が削除されたため、この関数は非推奨です
export async function triggerSync(): Promise<{ ok: boolean; guild_id?: string; roles?: number }> {
	throw new Error("triggerSync is no longer available - roles API has been removed");
}
