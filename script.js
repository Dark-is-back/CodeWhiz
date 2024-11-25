
        const buttons = $('.toggleButton');
        const boxes = $('.box');
        const sidebar = $('#sidebar');
        const overlay = $('#overlay');

        // Initialize CodeMirror editors
        const htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
            mode: "text/html",
            lineNumbers: true,
            lineWrapping: true,
            theme: "default",
            gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"],
            foldGutter: true,
            lint: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Tab": (cm) => {
                    cm.replaceSelection("    ");
                },
                "Ctrl-/": (cm) => {
                    const line = cm.getCursor().line;
                    const token = cm.getTokenAt(cm.getCursor());
                    if (token.type === "comment") {
                        cm.replaceRange("", { line: line, ch: token.start }, { line: line, ch: token.end });
                    } else {
                        cm.replaceRange("// ", { line: line, ch: 0 });
                    }
                }
            }
        });

        const cssEditor = CodeMirror.fromTextArea(document.getElementById("cssCode"), {
            mode: "text/css",
            lineNumbers: true,
            lineWrapping: true,
            theme: "default",
            gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"],
            foldGutter: true,
            lint: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Tab": (cm) => {
                    cm.replaceSelection("    ");
                },
                "Ctrl-/": (cm) => {
                    const line = cm.getCursor().line;
                    const token = cm.getTokenAt(cm.getCursor());
                    if (token.type === "comment") {
                        cm.replaceRange("", { line: line, ch: token.start }, { line: line, ch: token.end });
                    } else {
                        cm.replaceRange("/* ", { line: line, ch: 0 });
                    }
                }
            }
        });

        const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsCode"), {
            mode: "text/javascript",
            lineNumbers: true,
            lineWrapping: true,
            theme: "default",
            gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"],
            foldGutter: true,
            lint: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Tab": (cm) => {
                    cm.replaceSelection("    ");
                },
                "Ctrl-/": (cm) => {
                    const line = cm.getCursor().line;
                    const token = cm.getTokenAt(cm.getCursor());
                    if (token.type === "comment") {
                        cm.replaceRange("", { line: line, ch: token.start }, { line: line, ch: token.end });
                    } else {
                        cm.replaceRange("// ", { line: line, ch: 0 });
                    }
                }
            }
        });

        // إعداد الكود الافتراضي
        const defaultHtmlCode = `<!DOCTYPE html>
<html lang="ar">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>صفحة تجريبية</title>
 </head>
  <body>
   <center>
     <h1> هذه صفحة بسيطة جدا </h1>
   </center>
 </body>
</html>
        `;

        const defaultCssCode = `body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
 }

h1 {
  color: gold;
 }
        `;

        const defaultJsCode = `
        `;

        // تعيين القيم الافتراضية
        function setDefaultValues() {
            htmlEditor.setValue(defaultHtmlCode);
            cssEditor.setValue(defaultCssCode);
            jsEditor.setValue(defaultJsCode);
        }

        $(document).ready(() => {
            setDefaultValues();
            boxes.hide();
            $('#htmlBox').show(); // عرض محرر HTML بشكل افتراضي

            // عرض الأكواد بشكل مرئي
            $('#htmlCode').val(defaultHtmlCode);
            $('#cssCode').val(defaultCssCode);
            $('#jsCode').val(defaultJsCode);

            buttons.each((index, button) => {
                $(button).on('click', function() {
                    $(this).addClass('animate__rubberBand');
                    setTimeout(() => {
                        $(this).removeClass('animate__rubberBand');
                    }, 1000);

                    boxes.fadeOut(300, () => {
                        $(boxes[index]).fadeIn(300);
                    });
                });
            });

            // دالة رفع الملف
            $('#uploadButton').on('click', () => {
                gsap.to('#uploadButton', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
                $('#fileInput').click();
            });

            $('#fileInput').on('change', function() {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const fileContent = event.target.result;
                    const fileExtension = file.name.split('.').pop();

                    // افتح المحرر المناسب بناءً على نوع الملف
                    if (fileExtension === 'html') {
                        htmlEditor.setValue(fileContent);
                        boxes.hide();
                        $('#htmlBox').show();
                    } else if (fileExtension === 'css') {
                        cssEditor.setValue(fileContent);
                        boxes.hide();
                        $('#cssBox').show();
                    } else if (fileExtension === 'js') {
                        jsEditor.setValue(fileContent);
                        boxes.hide();
                        $('#jsBox').show();
                    } else {
                        alert("نوع الملف غير مدعوم. يجب أن يكون .html أو .css أو .js");
                    }
                };

                reader.readAsText(file);
            });

            // تشغيل الأكواد
            $('.runButton').on('click', () => {
                gsap.to('.runButton', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });

                const html = htmlEditor.getValue();
                const css = cssEditor.getValue();
                const js = jsEditor.getValue();

                const outputFrame = `
                    <!DOCTYPE html>
                    <html lang="ar">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
                        <style>${css}</style>
                    </head>
                    <body>
                        <button class="backButton" onclick="window.close();" style="background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 15px; cursor: pointer; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#45a049';" onmouseout="this.style.backgroundColor='#4CAF50';"><i class="fas fa-arrow-left"> رجوع</i></button>
                        ${html}
                        <script>
                            ${js}
                        <\/script>
                    </body>
                    </html>
                `;

                const outputWindow = window.open('', 'معاينة', 'width=100%,height=100%');
                outputWindow.document.write(outputFrame);
                outputWindow.document.close();
            });

            // إعادة تعيين الأكواد
            $('.resetButton').on('click', () => {
                gsap.to('.resetButton', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
                
                setDefaultValues();
                boxes.hide();
                $('#htmlBox').show(); // إعادة عرض محرر HTML عند إعادة التعيين
            });

            // نسخ الأكواد
            $('.copyButton').on('click', () => {
                gsap.to('.copyButton', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });

                const activeEditor = $('.box:visible textarea').attr('id');
                let codeToCopy = '';

                if (activeEditor === 'htmlCode') {
                    codeToCopy = htmlEditor.getValue();
                } else if (activeEditor === 'cssCode') {
                    codeToCopy = cssEditor.getValue();
                } else if (activeEditor === 'jsCode') {
                    codeToCopy = jsEditor.getValue();
                }

                navigator.clipboard.writeText(codeToCopy).then(() => {
                    alert("تم نسخ الكود بنجاح!");
                }, () => {
                    alert("فشل في نسخ الكود.");
                });
            });

            // حفظ الأكواد
            $('.saveButton').on('click', () => {
                gsap.to('.saveButton', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });

                const html = htmlEditor.getValue();
                const css = cssEditor.getValue();
                const js = jsEditor.getValue();

                const zip = new JSZip();
                zip.file("index.html", html);
                zip.file("style.css", css);
                zip.file("script.js", js);

                const folderName = prompt("أدخل اسم المجلد لحفظ الملفات:", "مجلد الأكواد") || "مجلد الأكواد";

                zip.generateAsync({ type: "blob" })
                .then((content) => {
                    saveAs(content, `${folderName}.zip`);
                });
            });

            // التنقل بين المحررات عند الضغط على Tab
            $(document).on('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const activeEditor = $('.box:visible textarea').attr('id');
                    if (activeEditor === 'htmlCode') {
                        cssEditor.focus();
                    } else if (activeEditor === 'cssCode') {
                        jsEditor.focus();
                    } else if (activeEditor === 'jsCode') {
                        htmlEditor.focus();
                    }
                }
            });

            // فتح القائمة الجانبية
            $('.menuButton').on('click', () => {
                sidebar.addClass('open');
                overlay.show();
            });

            // إغلاق القائمة الجانبية
            $('.closeSidebar').on('click', () => {
                sidebar.removeClass('open');
                overlay.hide();
            });

            // تغيير الثيم
            $('.theme-button').on('click', function() {
                const color = $(this).data('color');
                $('body').css('background-color', color);
                $('#themeModal').fadeOut(); // إغلاق النافذة بعد اختيار الثيم
            });

            // فتح نافذة الثيمات
            $('#showModalButton').on('click', () => {
                $('#themeModal').fadeIn();
            });

            // إغلاق نافذة الثيمات
            $('.closeModal').on('click', () => {
                $('#themeModal').fadeOut();
            });
        });

        // تغيير حجم الخط في محرر CodeMirror
        $('#fontSizeSelect').on('change', function() {
            const selectedFontSize = $(this).val();
            $('.CodeMirror').css('font-size', selectedFontSize); // تغيير حجم الخط في محرر CodeMirror
        });