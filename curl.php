<?php
// ��ʼ��һ�� cURL ����
$curl = curl_init();

// ��������Ҫץȡ��URL
curl_setopt($curl, CURLOPT_URL, 'http://localhost/xs/index.html');

// ����header
curl_setopt($curl, CURLOPT_HEADER, 1);

// ����cURL ������Ҫ�������浽�ַ����л����������Ļ�ϡ�
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

// ����cURL��������ҳ
$data = curl_exec($curl);

// �ر�URL����
curl_close($curl);

// ��ʾ��õ�����
echo $data;
?>