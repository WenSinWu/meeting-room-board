/* 預約時段衝突判斷（純函式，無 DOM／儲存依賴）。以一般 script 載入，函式為全域。 */

// 'HH:MM' 轉為當日分鐘數；格式不正確回傳 NaN
function toMin(s){
  var m = /^(\d{2}):(\d{2})$/.exec(s);
  if (!m) return NaN;
  var h = +m[1], mi = +m[2];
  if (h > 24 || mi > 59 || (h === 24 && mi > 0)) return NaN;
  return h * 60 + mi;
}

// 兩筆預約是否衝突：同會議室、同日、時間區間有交集（首尾相接不算衝突）
function overlaps(a, b){
  return a.roomId === b.roomId && a.date === b.date &&
    toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);
}

// 在 bookings 中找出與 d 衝突的第一筆預約；無衝突回傳 null。excludeId 用於編輯時排除自己
function findConflict(d, bookings, excludeId){
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    if (b.id !== excludeId && overlaps(d, b)) return b;
  }
  return null;
}
