import * as fabric from '../../../../fabric';
export async function animateMouseToPosition(userNo: any, left: any, top: any) {
  const currentLeft = parseInt($(`#${userNo}`).css('left'), 10);
  const currentTop = parseInt($(`#${userNo}`).css('top'), 10);

  await fabric.util.animate({
    startValue: 1,
    endValue: 5,
    duration: 200,
    onChange(value) {
      const newLeft = currentLeft + ((left - currentLeft) * value) / 5;
      const newTop = currentTop + ((top - currentTop) * value) / 5;
      $(`#${userNo}`).css('left', newLeft);
      $(`#${userNo}`).css('top', newTop);
    },
    easing: fabric.util.ease.easeInOutQuad,
    onComplete() {},
  });
}

export default animateMouseToPosition;
