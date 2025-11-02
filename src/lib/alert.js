import Swal from 'sweetalert2';

// ✅ สำเร็จ
export const alertSuccess = async (msg = 'สำเร็จ!') => {
  return await Swal.fire({
    icon: 'success',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
  });
};


// ⚠️ ผิดพลาด
export const alertError = async (msg = 'เกิดข้อผิดพลาด!') => {
  return await Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: msg,
  });
};

// ❓ ยืนยัน
export const alertConfirm = async (msg = 'ยืนยันการทำรายการหรือไม่?') => {
  const result = await Swal.fire({
    icon: 'question',
    title: msg,
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });
  return result.isConfirmed;
};

// ✅ ฟังก์ชัน popup ขอบคุณ
export const onConfirm = async () => {
  return await Swal.fire({
    icon: 'success',
    title: 'ขอบคุณที่ใช้บริการ ❤️',
    text: 'ระบบจะพาคุณกลับไปยังหน้าหลัก',
    showConfirmButton: false,
    timer: 1500,
  });
};
