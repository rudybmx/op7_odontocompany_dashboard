import os
path = '/opt/wersun/meta_sync.py'
if not os.path.exists(path):
    path = 'C:/opt/wersun/meta_sync.py'

if not os.path.exists(path):
    print("Cannot find meta_sync.py")
else:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old = "    # Atualiza last_sync_at"
    new = """    # Atualiza dados financeiros da conta
    try:
        import urllib.parse as _up

        # Busca dados financeiros
        _fields = ",".join([
            "id,name,account_status,balance,amount_spent,spend_cap",
            "is_prepay_account,funding_source_details,business",
        ])
        _params = _up.urlencode({"fields": _fields, "access_token": token})
        _url = f"https://graph.facebook.com/{META_VERSION}/{meta_account_id}?{_params}"
        _info = meta_get(_url)

        _balance       = float(_info.get("balance", 0)) / 100
        _amount_spent  = float(_info.get("amount_spent", 0)) / 100
        _spend_cap     = float(_info.get("spend_cap", 0)) / 100
        _acc_status    = _info.get("account_status", 1)
        _is_prepay     = str(_info.get("is_prepay_account", False)).lower()

        _fsd           = _info.get("funding_source_details", {})
        _fsd_display   = _fsd.get("display_string", "")
        _fsd_type      = _fsd.get("type", 0)
        _fsd_id        = _fsd.get("id", "")

        _biz           = _info.get("business", {})
        _bm_id_meta    = _biz.get("id", "")
        _bm_name       = _biz.get("name", "")

        psql(f\"\"\"
            UPDATE meta_ad_accounts SET
              balance                = {_balance},
              amount_spent           = {_amount_spent},
              spend_cap              = {_spend_cap},
              account_status         = {_acc_status},
              is_prepay_account      = {_is_prepay},
              funding_source_display = '{_fsd_display}',
              funding_source_type    = {_fsd_type},
              funding_source_id      = '{_fsd_id}',
              bm_id_meta             = '{_bm_id_meta}',
              bm_name                = '{_bm_name}',
              updated_at             = now()
            WHERE account_id = '{meta_account_id}'
        \"\"\")
        print(f"  \U0001f4b0 Saldo: R$ {_balance:.2f} | Limite: R$ {_spend_cap:.2f} | {_fsd_display}")
    except Exception as e:
        print(f"  \u26a0\ufe0f Dados financeiros não atualizados: {e}")

    # Atualiza last_sync_at"""

    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Script atualizado \u2705")
    
    # Run the script and get first 20 lines
    import subprocess
    result = subprocess.run(["python", path], capture_output=True, text=True)
    lines = result.stdout.split('\n') + result.stderr.split('\n')
    for line in lines[:20]:
        print(line)
