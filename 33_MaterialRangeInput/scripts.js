// https://material.io/guidelines/components/sliders.html#
// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=F4511E
// https://material.io/guidelines/style/color.html#color-color-tool

$('input[type="range"]').change(function () {
    var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    $(this).css('border-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #ef6c00), '
                + 'color-stop(' + val + ', #b5b5b6)'
                + ')'
                );
});