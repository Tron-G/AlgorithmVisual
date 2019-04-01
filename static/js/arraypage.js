/**
 * @description 输入窗口
 */
async function drawWindow() {

    let post_data = {};//向后台传输的数据包
    let get_data = {};//后台返回的的数据包
    post_data.input_tpye = 0; // 数据生成方式，0默认为手动输入，1为随机
    post_data.array_data = null;//保存数组值
    post_data.operate_type = 0;//进行的操作类型，0：无，1：查找，2：修改
    post_data.search_num = -1;//要查找的数值
    post_data.change_pos = -1;//要修改的数值下标
    post_data.change_num = -1;//要修改的数值


    // 手动输入创建数组
    $('#submit_bt').click(function () {

        let user_data = $('#user_data').val();
        let array_num;

        let input_error = 0;  // 错误类型
        if (user_data === "") {
            input_error = 1;  // 空串
        }
        else {
            array_num = user_data.split(',');
            if (array_num.length > 20) {
                input_error = 2;  // 数组长度超过20
            }
            else {
                for (let i = 0; i < array_num.length; i++) {
                    if (isNaN(array_num[i]) === true) {
                        input_error = 3;  // 含有非法字符
                    }
                    else if (array_num[i] === "") {
                        input_error = 3;  // 含有非法字符
                    }
                    else if (array_num[i] < 0 || array_num[i] > 999 || array_num[i].indexOf('.') !== -1 ) {
                        input_error = 4;  // 值超出范围或非整数
                    }
                }
            }
        }
        if (input_error !== 0) {
            switch (input_error) {
                case 1:
                    alert("请输入数组");
                    break;
                case 2:
                    alert("请输入长度小于20的数组");
                    break;
                case 3:
                    alert("输入含非法字符，请重新输入");
                    break;
                case 4:
                    alert("请输入0到999间的整数");
                    break;
            }
        }
        else {
            post_data.input_tpye = 0;
            post_data.array_data = array_num.slice(0);//深拷贝

            let temp = postData(post_data);
            get_data = JSON.parse(JSON.stringify(temp));

            console.log("data", get_data);

            drawScreen(get_data.array_data);

        }

    });
    // 随机创建
    $('#random_bt').click(function () {
        post_data.input_tpye = 1;
        let temp = postData(post_data);
        get_data = JSON.parse(JSON.stringify(temp));

        console.log("data", get_data);

        drawScreen(get_data.array_data);

    });

}

drawWindow();

/**
 * @description 主视图绘制
 * @param {Array} array_data 数组数据
 */
function drawScreen(array_data) {
    d3.select("#screen_svg").remove();

    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", width)
        .attr("height", height);

    let rect_length = 50;//矩形边长
    let total_len = rect_length * array_data.length;//总长度
    svg.selectAll("rect") // 数组矩形绘制
        .data(array_data)
        .enter()
        .append('g')
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr("y", height / 2 - rect_length)
        .attr("width", rect_length)
        .attr("height", rect_length)
        .attr("fill", "white")
        .attr("stroke", "#4CB4E7")
        .attr("stroke-width", 3);

    svg.selectAll('g') // 数组数字绘制
        .append("text")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr('x', function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr('y', height / 2 - rect_length)
        .attr("dx", rect_length / 4.5)
        .attr("dy", rect_length / 1.5)
        .attr("fill","#56A36C")
        .text(function (d) {
            return d;
        });

    svg.selectAll('g') // 数组下标绘制
        .append("text")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr('x', function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr('y', height / 2 - rect_length)
        .attr("dx", rect_length / 10)
        .attr("dy", rect_length*1.5)
        .attr("fill","#A3A380")
        .text(function (d, i) {
            return "a["+i+"]";
        });



}

/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    // cb = cb || (_ => {});
    let temp = $.ajax({
        type: 'POST',
        url: "/array_method",
        async: false,
        data: JSON.stringify(p_data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            return data;
        }
    });
    return temp.responseJSON;
}