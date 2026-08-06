const repos=['miuuyy/codex-chatgpt-web','agentify-sh/desktop','steipete/oracle','adamallcock/codex-chatgpt-control'];
for (const repo of repos) {
  const get=async p=>{const r=await fetch('https://api.github.com/repos/'+repo+p,{headers:{'User-Agent':'Codex-research'}}); return {status:r.status, data:await r.json()};};
  const [m,rel,iss,commits]=await Promise.all([get(''),get('/releases?per_page=5'),get('/issues?state=all&per_page=10'),get('/commits?per_page=3')]);
  console.log('\n---'+repo+'---');
  console.log(JSON.stringify({metadata:{html_url:m.data.html_url,description:m.data.description,default_branch:m.data.default_branch,license:m.data.license?.spdx_id||null,created_at:m.data.created_at,updated_at:m.data.updated_at,pushed_at:m.data.pushed_at,open_issues_count:m.data.open_issues_count,archived:m.data.archived,stars:m.data.stargazers_count},releases:(rel.data||[]).map(x=>({tag_name:x.tag_name,name:x.name,published_at:x.published_at,html_url:x.html_url,prerelease:x.prerelease})),issues:(iss.data||[]).filter(x=>!x.pull_request).map(x=>({number:x.number,title:x.title,state:x.state,created_at:x.created_at,updated_at:x.updated_at,html_url:x.html_url})),commits:(commits.data||[]).map(x=>({sha:x.sha,date:x.commit?.author?.date,message:x.commit?.message?.split('\n')[0],html_url:x.html_url}))},null,2));
}
