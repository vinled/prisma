import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_edit = """  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.details.images && prop.details.images.length > 0 ? prop.details.images : (prop.thumbnail ? [prop.thumbnail] : []));
    setIdEmEdicao(prop.id);
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setActiveTab('criacao');
  };"""

new_edit = """  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.details.images && prop.details.images.length > 0 ? prop.details.images : (prop.thumbnail ? [prop.thumbnail] : []));
    setIdEmEdicao(prop.id);
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setGeneratedCaption(prop.details.generated_copy || '');
    setActiveTab('criacao');
  };"""

if old_edit in content:
    content = content.replace(old_edit, new_edit)
else:
    print("Old handleEdit not found")

old_fetch_success = """      const result = await response.json();
      setGeneratedCaption(result.caption);
    } catch (error: any) {"""
new_fetch_success = """      const result = await response.json();
      setGeneratedCaption(result.caption);
      setDetails(prev => ({ ...prev, generated_copy: result.caption }));
    } catch (error: any) {"""

if old_fetch_success in content:
    content = content.replace(old_fetch_success, new_fetch_success)
else:
    print("Old fetch success not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
